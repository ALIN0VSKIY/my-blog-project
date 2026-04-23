import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-add-article-form',
    templateUrl: './add-article-form.html',
    styleUrl: './add-article-form.scss',
    standalone: true,
    imports: [FormsModule, CommonModule],
    encapsulation: ViewEncapsulation.None
})
export class AddArticleForm {
    @Output() submit = new EventEmitter<{ title: string; content: string }>();
    @Output() cancel = new EventEmitter<void>();  // ← Переименовал close → cancel

    title = '';
    content = '';

    onSubmit() {
        const title = this.title.trim();
        const content = this.content.trim();

        // Строгая валидация
        if (title && content) {
            this.submit.emit({ title, content });
            // Сброс полей после успешной отправки
            this.title = '';
            this.content = '';
        } else {
            alert('Пожалуйста, заполните все поля!');
            // НЕ эмитим, если валидация не прошла
        }
    }

    onCancel() {
        this.title = '';
        this.content = '';
        this.cancel.emit();  // ← Эмитим cancel
    }
}