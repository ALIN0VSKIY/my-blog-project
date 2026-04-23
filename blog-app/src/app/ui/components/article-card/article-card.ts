import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';

export interface Article {
    id: number;
    title: string;
    date: Date;
    description: string;
    featured?: boolean;
}

@Component({
    selector: 'app-article-card',
    templateUrl: './article-card.html',
    styleUrl: './article-card.scss',
    standalone: true,
    imports: [DatePipe, NgIf],
    encapsulation: ViewEncapsulation.None
})
export class ArticleCard {
    @Input() article!: Article;
    @Output() delete = new EventEmitter<number>();

    onDelete() {
        this.delete.emit(this.article.id);
    }
}