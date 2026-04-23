import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './ui/components/header/header';
import { Footer } from './ui/components/footer/footer';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    standalone: true,
    imports: [RouterOutlet, Header, Footer]
})
export class App {
    title = 'blog-app';
}