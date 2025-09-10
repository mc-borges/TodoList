import { Component } from '@angular/core';
import { Location } from '@angular/common';

interface Creator {
  name: string;
  course: string;
  role: string;
  imageUrl: string;
  socialLinks: {
    whatsapp: string;
    linkedin: string;
    email: string;
    portfolio: string;
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
  creators: Creator[] = [
    {
      name: 'Maria Clara Borges',
      course: 'Sistemas de Informação',
      role: 'UX/UI Designer',
      imageUrl: '/images/maria.jpeg',
      socialLinks: {
        whatsapp: 'https://api.whatsapp.com/send?phone=556492213310&text=Contato%20sobre%20TaFeito',
        linkedin: 'https://www.linkedin.com/in/mariaclaraborges/',
        email: 'mailto:mariaclarasborges@hotmail.com',
        portfolio: 'https://clara-borges--portflio.super.site/'
      }
    },
    {
      name: 'Willy Naresse',
      course: 'Sistemas de Informação',
      role: 'Front-end',
      imageUrl: '/images/willy.png',
      socialLinks: {
        whatsapp: 'https://api.whatsapp.com/send?phone=553498887717&text=Contato%20sobre%20TaFeito',
        linkedin: 'https://www.linkedin.com/in/willynaresse/',
        email: 'mailto:willnaresse@gmail.com',
        portfolio: 'https://w-digitalresume.netlify.app/'
      }
    },
    {
      name: 'Eduardo Marson',
      course: 'Sistemas de Informação',
      role: 'Banco de dados',
      imageUrl: '/images/eduardo.jpeg',
      socialLinks: {
        whatsapp: 'https://api.whatsapp.com/send?phone=553492470151&text=Contato%20sobre%20TaFeito',
        linkedin: 'https://www.linkedin.com/in/eduardo-oliveira-marson-85539a322/',
        email: 'mailto:marsoneduardooliveira@gmail.com',
        portfolio: 'https://github.com/EduardooMarson'
      }
    },
    {
      name: 'João Gabriel',
      course: 'Sistemas de Informação',
      role: 'Back-end',
      imageUrl: '/images/joao.jpg',
      socialLinks: {
        whatsapp: 'https://api.whatsapp.com/send?phone=553898791639&text=Contato%20sobre%20TaFeito',
        linkedin: 'https://www.linkedin.com/in/joãogabrielsrodrigues',
        email: 'mailto:joaogsrodrigues21@gmail.com',
        portfolio: 'https://github.com/JoaoGabriel-SR'
      }
    },
    {
      name: 'Fabrício Stecca',
      course: 'Sistemas de Informação',
      role: 'Back-end',
      imageUrl: '/images/fabricio.jpeg',
      socialLinks: {
        whatsapp: 'https://api.whatsapp.com/send?phone=553496975551&text=Contato%20sobre%20TaFeito',
        linkedin: 'https://www.linkedin.com/in/fabricio-stecca/',
        email: 'mailto:fabricio.stecca200@gmail.com',
        portfolio: 'https://github.com/fabricio-stecca'
      }
    },
    {
      name: 'Gustavo Teixeira',
      course: 'Sistemas de Informação',
      role: 'Back-end',
      imageUrl: '/images/gustavo.jpg',
      socialLinks: {
        whatsapp: 'https://api.whatsapp.com/send?phone=559499445212&text=Contato%20sobre%20TaFeito',
        linkedin: 'https://www.linkedin.com/',
        email: 'mailto:email@example.com',
        portfolio: 'https://github.com/'
      }
    }
  ];

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }
}
