import { Component, ViewEncapsulation } from '@angular/core';
import { ArticleCard, Article } from '../../components/article-card/article-card';
import { AddArticleForm } from '../../components/add-article-form/add-article-form';
import { StatsDialog } from '../../components/stats-dialog/stats-dialog';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.html',
    styleUrl: './blog.scss',
    standalone: true,
    imports: [ArticleCard, AddArticleForm, StatsDialog, CommonModule],
    encapsulation: ViewEncapsulation.None
})
export class Blog {
    articles: Article[] = [
        {
            id: 1,
            title: 'Как создать адаптивный дизайн за 30 минут',
            date: new Date('2026-03-12'),
            description: 'В этой статье я расскажу о ключевых принципах создания мобильных интерфейсов, которые одинаково хорошо выглядят на всех устройствах. Вы узнаете о медиа-запросах, гибких сетках и практических примерах кода, которые можно использовать прямо сейчас.',
            featured: true
        },
        {
            id: 2,
            title: 'Angular vs React: что выбрать в 2026?',
            date: new Date('2026-03-10'),
            description: 'Сравнительный анализ двух популярных фреймворков для создания веб-приложений.',
            featured: false
        },
        {
            id: 3,
            title: 'TypeScript для начинающих',
            date: new Date('2026-03-05'),
            description: 'Полное руководство по типизации в JavaScript. Разбираем основы и продвинутые техники.',
            featured: false
        },
        {
            id: 4,
            title: 'CSS Grid и Flexbox: когда что использовать',
            date: new Date('2026-03-01'),
            description: 'Практическое руководство по выбору правильного инструмента для вёрстки.',
            featured: false
        },
        {
            id: 5,
            title: 'Оптимизация производительности Angular приложений',
            date: new Date('2026-02-25'),
            description: 'Советы и техники для ускорения работы ваших приложений.',
            featured: false
        }
    ];

    showForm = false;
    showStats = false;

    get lastArticleDate(): Date | null {
        if (this.articles.length === 0) return null;
        return this.articles.reduce((latest, article) =>
            article.date > latest ? article.date : latest
            , this.articles[0].date);
    }

    onOverlayClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            this.closeForm();
        }
    }

    onAddArticle(articleData: { title: string; content: string }) {
        // Двойная защита: не создаём статью, если данные пустые
        if (!articleData.title.trim() || !articleData.content.trim()) {
            return;
        }

        const newArticle: Article = {
            id: Date.now(),
            title: articleData.title,
            date: new Date(),
            description: articleData.content,
            featured: false
        };

        this.articles = [newArticle, ...this.articles];
        this.showForm = false;
    }


    onDeleteArticle(id: number) {
        if (confirm('Удалить эту статью?')) {
            this.articles = this.articles.filter(article => article.id !== id);
        }
    }

    openForm() {
        this.showForm = true;
    }

    closeForm() {
        this.showForm = false;
    }

    openStats() {
        this.showStats = true;
    }

    closeStats() {
        this.showStats = false;
    }
}