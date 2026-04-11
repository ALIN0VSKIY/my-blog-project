import { Component } from '@angular/core';
import { Header } from './ui/components/header/header';
import { Footer } from './ui/components/footer/footer';
import { Home } from './ui/pages/home/home';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    standalone: true,
    imports: [Header, Footer, Home]
})
export class App {
    title = 'blog-app';
}