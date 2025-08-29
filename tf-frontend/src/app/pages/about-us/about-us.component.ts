import { Component } from '@angular/core';
import { Location } from '@angular/common';

// Estrutura para tipagem dos criadores (opcional, mas boa prática)
interface Creator {
  name: string;
  course: string;
  role: string;
  imageUrl: string;
  socialLinks: {
    whatsapp: string;
    linkedin: string;
    email: string;
    portfolio: string; // Pode ser GitHub, Lattes, etc.
  };
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

  // Dados dos criadores para serem exibidos na página
  // IMPORTANTE: Ajuste os caminhos em 'imageUrl' para corresponder à sua pasta de assets.
  creators: Creator[] = [
    {
      name: 'Clara Borges',
      course: 'Sistemas de Informação',
      role: 'UX/UI Designer',
      imageUrl: 'assets/images/creators/clara.png',
      socialLinks: {
        whatsapp: '#',
        linkedin: '#',
        email: 'mailto:email@example.com',
        portfolio: '#'
      }
    },
    {
      name: 'Willy Naresse',
      course: 'Sistemas de Informação',
      role: 'Front-end',
      imageUrl: 'assets/images/creators/willy.png',
      socialLinks: {
        whatsapp: '#',
        linkedin: '#',
        email: 'mailto:email@example.com',
        portfolio: '#'
      }
    },
    {
      name: 'Eduardo Marson',
      course: 'Sistemas de Informação',
      role: 'Banco de dados',
      imageUrl: 'assets/images/creators/eduardo.png',
      socialLinks: {
        whatsapp: '#',
        linkedin: '#',
        email: 'mailto:email@example.com',
        portfolio: '#'
      }
    },
    {
      name: 'João Gabriel',
      course: 'Sistemas de Informação',
      role: 'Back-end',
      imageUrl: 'assets/images/creators/joao.png',
      socialLinks: {
        whatsapp: '#',
        linkedin: '#',
        email: 'mailto:email@example.com',
        portfolio: '#'
      }
    },
    {
      name: 'Fabrício Stecca',
      course: 'Sistemas de Informação',
      role: 'Back-end',
      imageUrl: 'assets/images/creators/fabricio.png',
      socialLinks: {
        whatsapp: '#',
        linkedin: '#',
        email: 'mailto:email@example.com',
        portfolio: '#'
      }
    },
    {
      name: 'Gustavo Teixeira',
      course: 'Sistemas de Informação',
      role: 'Back-end',
      imageUrl: 'assets/images/creators/gustavo.png',
      socialLinks: {
        whatsapp: '#',
        linkedin: '#',
        email: 'mailto:email@example.com',
        portfolio: '#'
      }
    }
  ];

  constructor(private location: Location) { }

  // Função para navegar para a página anterior
  goBack(): void {
    this.location.back();
  }
}