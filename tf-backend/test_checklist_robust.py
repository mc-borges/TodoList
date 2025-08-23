#!/usr/bin/env python3
"""
Script de teste robusto específico para Checklists
Testa cenários complexos, edge cases e performance do novo endpoint otimizado
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid
import threading
import concurrent.futures

# Configurações
BASE_URL = "http://localhost:8001"
TEST_EMAIL = f"checklist_test_{uuid.uuid4().hex[:8]}@teste.com"
TEST_PASSWORD = "teste123456"
TEST_NAME = "Checklist Tester"

class ChecklistTester:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.session = requests.Session()
        self.test_results = []
        self.checklist_ids = []
    
    def log_test(self, test_name, success, message="", response_data=None, duration=None):
        """Log do resultado do teste"""
        status = "✅ PASSOU" if success else "❌ FALHOU"
        duration_str = f" ({duration:.3f}s)" if duration else ""
        print(f"{status} - {test_name}{duration_str}")
        if message:
            print(f"   📝 {message}")
        if response_data and not success:
            print(f"   📊 Response: {json.dumps(response_data, indent=2)[:500]}...")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "duration": duration,
            "timestamp": datetime.now().isoformat()
        })
        print()
    
    def setup_auth(self):
        """Configura autenticação"""
        print("🔧 Configurando autenticação...")
        
        # Criar usuário
        payload = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        }
        
        response = self.session.post(f"{BASE_URL}/auth/signup", json=payload)
        
        if response.status_code in [200, 201]:
            data = response.json()
            self.token = data.get("access_token")
            self.user_id = data.get("id")
            
            # Configurar header de autorização
            self.session.headers.update({
                "Authorization": f"Bearer {self.token}"
            })
            
            self.log_test("Setup de autenticação", True, f"Usuário criado: {self.user_id}")
            return True
        else:
            self.log_test("Setup de autenticação", False, f"Status: {response.status_code}")
            return False
    
    def test_create_multiple_checklists(self):
        """Testa criação de múltiplas checklists"""
        print("🔧 Testando criação de múltiplas checklists...")
        
        start_time = time.time()
        
        checklists_data = [
            {
                "name": "Checklist Pessoal",
                "description": "Tarefas pessoais do dia",
                "category": "Pessoal",
                "show_motivational_msg": True
            },
            {
                "name": "Checklist Trabalho",
                "description": "Tarefas profissionais",
                "category": "Trabalho",
                "show_motivational_msg": False
            },
            {
                "name": "Checklist Estudos",
                "description": "Matérias para estudar",
                "category": "Educação",
                "limit_date": (datetime.now() + timedelta(days=7)).isoformat(),
                "change_color_by_date": True
            },
            {
                "name": "Checklist Urgente",
                "description": "Tarefas urgentes",
                "category": "Urgente",
                "limit_date": (datetime.now() + timedelta(days=1)).isoformat(),
                "change_color_by_date": True,
                "show_motivational_msg": True
            },
            {
                "name": "Checklist Longa",
                "description": "Checklist com muitos itens para testar performance",
                "category": "Teste"
            }
        ]
        
        success_count = 0
        
        for i, checklist_data in enumerate(checklists_data):
            response = self.session.post(f"{BASE_URL}/checklists", json=checklist_data)
            
            if response.status_code in [200, 201]:
                data = response.json()
                self.checklist_ids.append(data.get("id"))
                success_count += 1
            else:
                self.log_test(f"Criação checklist {i+1}", False, f"Status: {response.status_code}")
        
        duration = time.time() - start_time
        
        if success_count == len(checklists_data):
            self.log_test(
                "Criação de múltiplas checklists",
                True,
                f"{success_count} checklists criadas com sucesso",
                duration=duration
            )
            return True
        else:
            self.log_test(
                "Criação de múltiplas checklists",
                False,
                f"Apenas {success_count}/{len(checklists_data)} criadas"
            )
            return False
    
    def test_bulk_items_performance(self):
        """Testa performance do endpoint em lote com muitos itens"""
        print("🔧 Testando performance com muitos itens...")
        
        if not self.checklist_ids:
            self.log_test("Performance com muitos itens", False, "Nenhuma checklist disponível")
            return False
        
        # Usar a última checklist (checklist longa)
        checklist_id = self.checklist_ids[-1]
        
        # Criar 50 itens de uma vez
        items = []
        for i in range(50):
            items.append({
                "id": None,
                "title": f"Tarefa {i+1:02d} - Item de teste performance",
                "description": f"Descrição detalhada da tarefa {i+1} para testar performance do sistema",
                "completed": i % 3 == 0  # Algumas marcadas como completas
            })
        
        payload = {"items": items}
        
        start_time = time.time()
        response = self.session.put(f"{BASE_URL}/checklists/{checklist_id}/items", json=payload)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            created_count = data.get("created_count", 0)
            
            if created_count == 50:
                self.log_test(
                    "Performance com muitos itens",
                    True,
                    f"50 itens criados em lote com sucesso",
                    duration=duration
                )
                return True
            else:
                self.log_test(
                    "Performance com muitos itens",
                    False,
                    f"Esperado 50 itens, criados {created_count}"
                )
                return False
        else:
            self.log_test(
                "Performance com muitos itens",
                False,
                f"Status: {response.status_code}",
                response.json() if response.text else None
            )
            return False
    
    def test_complex_bulk_operations(self):
        """Testa operações complexas em lote"""
        print("🔧 Testando operações complexas em lote...")
        
        if len(self.checklist_ids) < 2:
            self.log_test("Operações complexas", False, "Não há checklists suficientes")
            return False
        
        checklist_id = self.checklist_ids[0]
        
        # Primeiro, criar alguns itens iniciais
        initial_items = [
            {
                "id": None,
                "title": "Item Original 1",
                "description": "Primeiro item original",
                "completed": False
            },
            {
                "id": None,
                "title": "Item Original 2", 
                "description": "Segundo item original",
                "completed": True
            },
            {
                "id": None,
                "title": "Item Para Deletar",
                "description": "Este item será deletado",
                "completed": False
            }
        ]
        
        # Criar itens iniciais
        response = self.session.put(f"{BASE_URL}/checklists/{checklist_id}/items", json={"items": initial_items})
        
        if response.status_code != 200:
            self.log_test("Operações complexas - setup", False, "Falha ao criar itens iniciais")
            return False
        
        initial_data = response.json()
        item_ids = [item["id"] for item in initial_data["items"]]
        
        time.sleep(1)  # Pequena pausa para garantir timestamps diferentes
        
        # Agora fazer operação complexa: atualizar, manter, deletar e criar novos
        complex_items = [
            {
                "id": item_ids[0],  # Atualizar primeiro item
                "title": "Item Original 1 ATUALIZADO",
                "description": "Descrição atualizada do primeiro item",
                "completed": True  # Mudou de False para True
            },
            {
                "id": item_ids[1],  # Manter segundo item inalterado
                "title": "Item Original 2",
                "description": "Segundo item original",
                "completed": True
            },
            # item_ids[2] não incluído = será deletado
            {
                "id": None,  # Criar novo item 1
                "title": "Novo Item Criado 1",
                "description": "Primeiro item criado na operação complexa",
                "completed": False
            },
            {
                "id": None,  # Criar novo item 2
                "title": "Novo Item Criado 2",
                "description": "Segundo item criado na operação complexa",
                "completed": True
            }
        ]
        
        start_time = time.time()
        response = self.session.put(f"{BASE_URL}/checklists/{checklist_id}/items", json={"items": complex_items})
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            
            expected_created = 2
            expected_updated = 2  # Mesmo que um seja "inalterado", conta como atualizado
            expected_deleted = 1
            
            created = data.get("created_count", 0)
            updated = data.get("updated_count", 0)
            deleted = data.get("deleted_count", 0)
            total_items = len(data.get("items", []))
            
            if (created == expected_created and 
                updated == expected_updated and 
                deleted == expected_deleted and
                total_items == 4):
                
                self.log_test(
                    "Operações complexas em lote",
                    True,
                    f"Operação complexa executada: {created} criados, {updated} atualizados, {deleted} deletados",
                    duration=duration
                )
                return True
            else:
                self.log_test(
                    "Operações complexas em lote",
                    False,
                    f"Contadores incorretos: C:{created}/{expected_created}, U:{updated}/{expected_updated}, D:{deleted}/{expected_deleted}, Total:{total_items}/4"
                )
                return False
        else:
            self.log_test(
                "Operações complexas em lote",
                False,
                f"Status: {response.status_code}",
                response.json() if response.text else None
            )
            return False
    
    def test_edge_cases(self):
        """Testa casos extremos"""
        print("🔧 Testando casos extremos...")
        
        if not self.checklist_ids:
            self.log_test("Casos extremos", False, "Nenhuma checklist disponível")
            return False
        
        checklist_id = self.checklist_ids[1] if len(self.checklist_ids) > 1 else self.checklist_ids[0]
        
        edge_cases = [
            # Caso 1: Lista vazia (deletar todos os itens)
            {
                "name": "Lista vazia",
                "items": [],
                "expected_created": 0,
                "expected_updated": 0
            },
            # Caso 2: Item com título muito longo
            {
                "name": "Título muito longo",
                "items": [{
                    "id": None,
                    "title": "A" * 500,  # Título de 500 caracteres
                    "description": "Testando título extremamente longo",
                    "completed": False
                }],
                "expected_created": 1,
                "expected_updated": 0
            },
            # Caso 3: Descrição muito longa
            {
                "name": "Descrição muito longa",
                "items": [{
                    "id": None,
                    "title": "Item com descrição longa",
                    "description": "B" * 1000,  # Descrição de 1000 caracteres
                    "completed": False
                }],
                "expected_created": 1,
                "expected_updated": 0
            },
            # Caso 4: Caracteres especiais
            {
                "name": "Caracteres especiais",
                "items": [{
                    "id": None,
                    "title": "🚀 Título com emojis 🎯 e símbolos @#$%^&*()",
                    "description": "Descrição com acentos: ção, maçã, coração ❤️",
                    "completed": False
                }],
                "expected_created": 1,
                "expected_updated": 0
            }
        ]
        
        success_count = 0
        
        for case in edge_cases:
            start_time = time.time()
            response = self.session.put(f"{BASE_URL}/checklists/{checklist_id}/items", json={"items": case["items"]})
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                created = data.get("created_count", 0)
                updated = data.get("updated_count", 0)
                
                if created == case["expected_created"] and updated == case["expected_updated"]:
                    self.log_test(
                        f"Edge case: {case['name']}",
                        True,
                        f"Caso tratado corretamente",
                        duration=duration
                    )
                    success_count += 1
                else:
                    self.log_test(
                        f"Edge case: {case['name']}",
                        False,
                        f"Contadores incorretos: C:{created}/{case['expected_created']}, U:{updated}/{case['expected_updated']}"
                    )
            else:
                self.log_test(
                    f"Edge case: {case['name']}",
                    False,
                    f"Status: {response.status_code}"
                )
        
        overall_success = success_count == len(edge_cases)
        self.log_test(
            "Casos extremos (geral)",
            overall_success,
            f"{success_count}/{len(edge_cases)} casos passaram"
        )
        
        return overall_success
    
    def test_concurrent_operations(self):
        """Testa operações concorrentes"""
        print("🔧 Testando operações concorrentes...")
        
        if len(self.checklist_ids) < 3:
            self.log_test("Operações concorrentes", False, "Não há checklists suficientes")
            return False
        
        def update_checklist_items(checklist_id, thread_id):
            """Função para atualizar itens de uma checklist em thread separada"""
            items = []
            for i in range(10):
                items.append({
                    "id": None,
                    "title": f"Thread {thread_id} - Item {i+1}",
                    "description": f"Item criado pela thread {thread_id}",
                    "completed": i % 2 == 0
                })
            
            response = self.session.put(f"{BASE_URL}/checklists/{checklist_id}/items", json={"items": items})
            return response.status_code == 200, response.json() if response.status_code == 200 else None
        
        # Executar 3 operações concorrentes em checklists diferentes
        start_time = time.time()
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            futures = []
            for i in range(3):
                checklist_id = self.checklist_ids[i]
                future = executor.submit(update_checklist_items, checklist_id, i+1)
                futures.append(future)
            
            results = []
            for future in concurrent.futures.as_completed(futures):
                results.append(future.result())
        
        duration = time.time() - start_time
        
        success_count = sum(1 for success, _ in results if success)
        
        if success_count == 3:
            self.log_test(
                "Operações concorrentes",
                True,
                f"3 operações concorrentes executadas com sucesso",
                duration=duration
            )
            return True
        else:
            self.log_test(
                "Operações concorrentes",
                False,
                f"Apenas {success_count}/3 operações bem-sucedidas"
            )
            return False
    
    def test_checklist_integrity(self):
        """Testa integridade dos dados das checklists"""
        print("🔧 Testando integridade dos dados...")
        
        success_count = 0
        total_tests = 0
        
        for i, checklist_id in enumerate(self.checklist_ids):
            total_tests += 1
            
            response = self.session.get(f"{BASE_URL}/checklists/{checklist_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Verificar campos obrigatórios
                required_fields = ["id", "name", "user_id", "created_at", "updated_at", "items"]
                has_required = all(field in data for field in required_fields)
                
                # Verificar se items é uma lista
                items_is_list = isinstance(data.get("items"), list)
                
                # Verificar se cada item tem campos obrigatórios
                items_valid = True
                for item in data.get("items", []):
                    item_required = ["id", "title", "completed", "checklist_id"]
                    if not all(field in item for field in item_required):
                        items_valid = False
                        break
                
                if has_required and items_is_list and items_valid:
                    success_count += 1
                    self.log_test(
                        f"Integridade checklist {i+1}",
                        True,
                        f"Estrutura válida com {len(data.get('items', []))} itens"
                    )
                else:
                    self.log_test(
                        f"Integridade checklist {i+1}",
                        False,
                        f"Estrutura inválida: campos={has_required}, lista={items_is_list}, itens={items_valid}"
                    )
            else:
                self.log_test(
                    f"Integridade checklist {i+1}",
                    False,
                    f"Status: {response.status_code}"
                )
        
        overall_success = success_count == total_tests
        self.log_test(
            "Integridade dos dados (geral)",
            overall_success,
            f"{success_count}/{total_tests} checklists com integridade válida"
        )
        
        return overall_success
    
    def test_performance_comparison(self):
        """Compara performance do novo endpoint vs operações individuais simuladas"""
        print("🔧 Testando comparação de performance...")
        
        if not self.checklist_ids:
            self.log_test("Comparação de performance", False, "Nenhuma checklist disponível")
            return False
        
        checklist_id = self.checklist_ids[0]
        
        # Limpar checklist primeiro
        self.session.put(f"{BASE_URL}/checklists/{checklist_id}/items", json={"items": []})
        
        # Preparar 20 itens para teste
        items = []
        for i in range(20):
            items.append({
                "id": None,
                "title": f"Performance Item {i+1}",
                "description": f"Item para teste de performance {i+1}",
                "completed": i % 4 == 0
            })
        
        # Teste 1: Operação em lote (novo endpoint)
        start_time = time.time()
        response = self.session.put(f"{BASE_URL}/checklists/{checklist_id}/items", json={"items": items})
        bulk_duration = time.time() - start_time
        
        bulk_success = response.status_code == 200
        
        # Limpar novamente para teste individual
        self.session.put(f"{BASE_URL}/checklists/{checklist_id}/items", json={"items": []})
        
        # Teste 2: Simular operações individuais (tempo de processamento)
        start_time = time.time()
        for item in items:
            # Simular tempo de uma requisição individual (processamento local)
            time.sleep(0.01)  # 10ms por operação (simulação otimista)
        simulated_individual_duration = time.time() - start_time
        
        if bulk_success:
            performance_improvement = simulated_individual_duration / bulk_duration
            
            self.log_test(
                "Comparação de performance",
                True,
                f"Bulk: {bulk_duration:.3f}s vs Individual simulado: {simulated_individual_duration:.3f}s - Melhoria: {performance_improvement:.1f}x"
            )
            return True
        else:
            self.log_test(
                "Comparação de performance",
                False,
                "Operação em lote falhou"
            )
            return False
    
    def cleanup(self):
        """Limpa dados de teste"""
        print("🧹 Limpando dados de teste...")
        
        success_count = 0
        
        for i, checklist_id in enumerate(self.checklist_ids):
            try:
                response = self.session.delete(f"{BASE_URL}/checklists/{checklist_id}")
                if response.status_code == 200:
                    success_count += 1
            except Exception as e:
                print(f"   ⚠️ Erro ao deletar checklist {i+1}: {str(e)}")
        
        self.log_test(
            "Limpeza geral",
            success_count == len(self.checklist_ids),
            f"{success_count}/{len(self.checklist_ids)} checklists deletadas"
        )
    
    def run_all_tests(self):
        """Executa todos os testes de checklist"""
        print("🚀 Iniciando Testes Robustos de Checklist")
        print("=" * 70)
        
        start_time = time.time()
        
        # Setup
        if not self.setup_auth():
            print("❌ Falha na autenticação. Encerrando testes.")
            return False
        
        # Lista de testes
        tests = [
            ("Múltiplas Checklists", self.test_create_multiple_checklists),
            ("Performance com Muitos Itens", self.test_bulk_items_performance),
            ("Operações Complexas", self.test_complex_bulk_operations),
            ("Casos Extremos", self.test_edge_cases),
            ("Operações Concorrentes", self.test_concurrent_operations),
            ("Integridade dos Dados", self.test_checklist_integrity),
            ("Comparação de Performance", self.test_performance_comparison)
        ]
        
        for test_name, test_func in tests:
            print(f"🎯 Executando: {test_name}")
            test_func()
            time.sleep(0.5)  # Pausa entre testes
        
        # Limpeza
        self.cleanup()
        
        # Relatório final
        end_time = time.time()
        total_duration = end_time - start_time
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print("=" * 70)
        print("📊 RELATÓRIO FINAL - TESTES DE CHECKLIST")
        print(f"⏱️  Tempo total: {total_duration:.2f}s")
        print(f"✅ Testes aprovados: {passed}/{total}")
        print(f"❌ Testes falharam: {total - passed}/{total}")
        
        if passed == total:
            print("🎉 TODOS OS TESTES DE CHECKLIST PASSARAM!")
            print("💪 Sistema robusto e pronto para produção!")
        else:
            print("⚠️  Alguns testes falharam. Sistema precisa de ajustes.")
        
        # Estatísticas de performance
        performance_tests = [r for r in self.test_results if r.get("duration")]
        if performance_tests:
            avg_duration = sum(r["duration"] for r in performance_tests) / len(performance_tests)
            print(f"📈 Tempo médio por teste: {avg_duration:.3f}s")
        
        return passed == total

if __name__ == "__main__":
    tester = ChecklistTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)
