#!/usr/bin/env python3
"""
Script de teste robusto para verificar todas as funcionalidades da API TodoList
Focando especialmente no novo endpoint otimizado de checklist items
"""

import requests
import json
import time
from datetime import datetime
import uuid

# Configurações
BASE_URL = "http://localhost:8001"
TEST_EMAIL = f"test_{uuid.uuid4().hex[:8]}@teste.com"
TEST_PASSWORD = "teste123456"
TEST_NAME = "Usuario Teste"

class APITester:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.checklist_id = None
        self.session = requests.Session()
        self.test_results = []
    
    def log_test(self, test_name, success, message="", response_data=None):
        """Log do resultado do teste"""
        status = "✅ PASSOU" if success else "❌ FALHOU"
        print(f"{status} - {test_name}")
        if message:
            print(f"   📝 {message}")
        if response_data and not success:
            print(f"   📊 Response: {json.dumps(response_data, indent=2)}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        })
        print()
    
    def test_user_signup(self):
        """Testa criação de usuário"""
        print("🔧 Testando criação de usuário...")
        
        payload = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        }
        
        try:
            response = self.session.post(f"{BASE_URL}/auth/signup", json=payload)
            
            if response.status_code in [200, 201]:  # Aceitar tanto 200 quanto 201
                data = response.json()
                self.token = data.get("access_token")
                self.user_id = data.get("id")
                
                # Configurar header de autorização
                self.session.headers.update({
                    "Authorization": f"Bearer {self.token}"
                })
                
                self.log_test(
                    "Criação de usuário",
                    True,
                    f"Usuário criado com sucesso. ID: {self.user_id}, Token obtido"
                )
                return True
            else:
                self.log_test(
                    "Criação de usuário",
                    False,
                    f"Status code: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
                
        except Exception as e:
            self.log_test("Criação de usuário", False, f"Erro: {str(e)}")
            return False
    
    def test_user_login(self):
        """Testa login do usuário"""
        print("🔧 Testando login de usuário...")
        
        payload = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        
        try:
            response = self.session.post(f"{BASE_URL}/auth/login", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                token = data.get("access_token")
                
                self.log_test(
                    "Login de usuário",
                    True,
                    "Login realizado com sucesso"
                )
                return True
            else:
                self.log_test(
                    "Login de usuário",
                    False,
                    f"Status code: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
                
        except Exception as e:
            self.log_test("Login de usuário", False, f"Erro: {str(e)}")
            return False
    
    def test_create_checklist(self):
        """Testa criação de checklist"""
        print("🔧 Testando criação de checklist...")
        
        payload = {
            "name": "Checklist de Teste",
            "description": "Uma checklist para testar a API",
            "category": "Teste",
            "show_motivational_msg": True
        }
        
        try:
            response = self.session.post(f"{BASE_URL}/checklists", json=payload)
            
            if response.status_code in [200, 201]:  # Aceitar tanto 200 quanto 201
                data = response.json()
                self.checklist_id = data.get("id")
                
                self.log_test(
                    "Criação de checklist",
                    True,
                    f"Checklist criada com sucesso. ID: {self.checklist_id}"
                )
                return True
            else:
                self.log_test(
                    "Criação de checklist",
                    False,
                    f"Status code: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
                
        except Exception as e:
            self.log_test("Criação de checklist", False, f"Erro: {str(e)}")
            return False
    
    def test_get_checklists(self):
        """Testa listagem de checklists"""
        print("🔧 Testando listagem de checklists...")
        
        try:
            response = self.session.get(f"{BASE_URL}/checklists")
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list) and len(data) > 0:
                    self.log_test(
                        "Listagem de checklists",
                        True,
                        f"Encontradas {len(data)} checklists"
                    )
                    return True
                else:
                    self.log_test(
                        "Listagem de checklists",
                        False,
                        "Nenhuma checklist encontrada ou formato inválido"
                    )
                    return False
            else:
                self.log_test(
                    "Listagem de checklists",
                    False,
                    f"Status code: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
                
        except Exception as e:
            self.log_test("Listagem de checklists", False, f"Erro: {str(e)}")
            return False
    
    def test_get_single_checklist(self):
        """Testa busca de checklist específica"""
        print("🔧 Testando busca de checklist específica...")
        
        try:
            response = self.session.get(f"{BASE_URL}/checklists/{self.checklist_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("id") == self.checklist_id:
                    self.log_test(
                        "Busca de checklist específica",
                        True,
                        f"Checklist encontrada: {data.get('name')}"
                    )
                    return True
                else:
                    self.log_test(
                        "Busca de checklist específica",
                        False,
                        "ID da checklist não confere"
                    )
                    return False
            else:
                self.log_test(
                    "Busca de checklist específica",
                    False,
                    f"Status code: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
                
        except Exception as e:
            self.log_test("Busca de checklist específica", False, f"Erro: {str(e)}")
            return False
    
    def test_bulk_update_checklist_items_create(self):
        """Testa o novo endpoint otimizado - criação de itens em lote"""
        print("🔧 Testando criação de itens em lote (NOVO ENDPOINT)...")
        
        payload = {
            "items": [
                {
                    "id": None,
                    "title": "Primeira tarefa",
                    "description": "Descrição da primeira tarefa",
                    "completed": False
                },
                {
                    "id": None,
                    "title": "Segunda tarefa",
                    "description": "Descrição da segunda tarefa",
                    "completed": True
                },
                {
                    "id": None,
                    "title": "Terceira tarefa",
                    "description": "Descrição da terceira tarefa",
                    "completed": False
                }
            ]
        }
        
        try:
            response = self.session.put(f"{BASE_URL}/checklists/{self.checklist_id}/items", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                
                if (data.get("created_count") == 3 and 
                    data.get("updated_count") == 0 and 
                    len(data.get("items", [])) == 3):
                    
                    # Salvar IDs dos itens para próximos testes
                    self.item_ids = [item["id"] for item in data["items"]]
                    
                    self.log_test(
                        "Criação de itens em lote",
                        True,
                        f"3 itens criados com sucesso. IDs: {self.item_ids}"
                    )
                    return True
                else:
                    self.log_test(
                        "Criação de itens em lote",
                        False,
                        f"Contadores incorretos: criados={data.get('created_count')}, atualizados={data.get('updated_count')}",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Criação de itens em lote",
                    False,
                    f"Status code: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
                
        except Exception as e:
            self.log_test("Criação de itens em lote", False, f"Erro: {str(e)}")
            return False
    
    def test_bulk_update_checklist_items_mixed(self):
        """Testa o novo endpoint - operações mistas (criar, atualizar, deletar)"""
        print("🔧 Testando operações mistas de itens (NOVO ENDPOINT)...")
        
        if not hasattr(self, 'item_ids') or len(self.item_ids) < 3:
            self.log_test("Operações mistas de itens", False, "IDs de itens não disponíveis do teste anterior")
            return False
        
        payload = {
            "items": [
                {
                    "id": self.item_ids[0],  # Atualizar primeiro item
                    "title": "Primeira tarefa ATUALIZADA",
                    "description": "Descrição atualizada",
                    "completed": True
                },
                {
                    "id": self.item_ids[1],  # Manter segundo item
                    "title": "Segunda tarefa",
                    "description": "Descrição da segunda tarefa",
                    "completed": True
                },
                # Terceiro item será deletado (não incluído)
                {
                    "id": None,  # Criar novo item
                    "title": "Quarta tarefa NOVA",
                    "description": "Nova tarefa criada",
                    "completed": False
                }
            ]
        }
        
        try:
            response = self.session.put(f"{BASE_URL}/checklists/{self.checklist_id}/items", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                
                if (data.get("created_count") == 1 and 
                    data.get("updated_count") == 2 and 
                    data.get("deleted_count") == 1 and
                    len(data.get("items", [])) == 3):
                    
                    self.log_test(
                        "Operações mistas de itens",
                        True,
                        f"Operações: 1 criado, 2 atualizados, 1 deletado"
                    )
                    return True
                else:
                    self.log_test(
                        "Operações mistas de itens",
                        False,
                        f"Contadores incorretos: criados={data.get('created_count')}, atualizados={data.get('updated_count')}, deletados={data.get('deleted_count')}",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Operações mistas de itens",
                    False,
                    f"Status code: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
                
        except Exception as e:
            self.log_test("Operações mistas de itens", False, f"Erro: {str(e)}")
            return False
    
    def test_checklist_with_items(self):
        """Testa se a checklist retorna os itens corretamente"""
        print("🔧 Testando checklist com itens...")
        
        try:
            response = self.session.get(f"{BASE_URL}/checklists/{self.checklist_id}")
            
            if response.status_code == 200:
                data = response.json()
                items = data.get("items", [])
                
                if len(items) == 3:  # Deve ter 3 itens após as operações mistas
                    self.log_test(
                        "Checklist com itens",
                        True,
                        f"Checklist contém {len(items)} itens conforme esperado"
                    )
                    return True
                else:
                    self.log_test(
                        "Checklist com itens",
                        False,
                        f"Esperado 3 itens, encontrado {len(items)}"
                    )
                    return False
            else:
                self.log_test(
                    "Checklist com itens",
                    False,
                    f"Status code: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
                
        except Exception as e:
            self.log_test("Checklist com itens", False, f"Erro: {str(e)}")
            return False
    
    def test_update_checklist(self):
        """Testa atualização de checklist"""
        print("🔧 Testando atualização de checklist...")
        
        payload = {
            "name": "Checklist de Teste ATUALIZADA",
            "description": "Descrição atualizada da checklist"
        }
        
        try:
            response = self.session.put(f"{BASE_URL}/checklists/{self.checklist_id}", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("name") == payload["name"]:
                    self.log_test(
                        "Atualização de checklist",
                        True,
                        "Checklist atualizada com sucesso"
                    )
                    return True
                else:
                    self.log_test(
                        "Atualização de checklist",
                        False,
                        "Nome da checklist não foi atualizado"
                    )
                    return False
            else:
                self.log_test(
                    "Atualização de checklist",
                    False,
                    f"Status code: {response.status_code}",
                    response.json() if response.text else None
                )
                return False
                
        except Exception as e:
            self.log_test("Atualização de checklist", False, f"Erro: {str(e)}")
            return False
    
    def cleanup(self):
        """Limpa os dados de teste"""
        print("🧹 Limpando dados de teste...")
        
        if self.checklist_id:
            try:
                response = self.session.delete(f"{BASE_URL}/checklists/{self.checklist_id}")
                if response.status_code == 200:
                    self.log_test("Limpeza - deletar checklist", True, "Checklist deletada com sucesso")
                else:
                    self.log_test("Limpeza - deletar checklist", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test("Limpeza - deletar checklist", False, f"Erro: {str(e)}")
    
    def run_all_tests(self):
        """Executa todos os testes"""
        print("🚀 Iniciando testes da API TodoList")
        print("=" * 60)
        
        start_time = time.time()
        
        # Executar testes em sequência
        tests = [
            self.test_user_signup,
            self.test_user_login,
            self.test_create_checklist,
            self.test_get_checklists,
            self.test_get_single_checklist,
            self.test_bulk_update_checklist_items_create,
            self.test_bulk_update_checklist_items_mixed,
            self.test_checklist_with_items,
            self.test_update_checklist
        ]
        
        for test in tests:
            test()
            time.sleep(0.5)  # Pequena pausa entre testes
        
        # Limpeza
        self.cleanup()
        
        # Relatório final
        end_time = time.time()
        duration = end_time - start_time
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print("=" * 60)
        print(f"📊 RELATÓRIO FINAL")
        print(f"⏱️  Tempo total: {duration:.2f}s")
        print(f"✅ Testes aprovados: {passed}/{total}")
        print(f"❌ Testes falharam: {total - passed}/{total}")
        
        if passed == total:
            print("🎉 TODOS OS TESTES PASSARAM! API funcionando perfeitamente!")
        else:
            print("⚠️  Alguns testes falharam. Verifique os logs acima.")
        
        return passed == total

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)
