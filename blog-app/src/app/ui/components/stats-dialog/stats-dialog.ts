import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-stats-dialog',
    templateUrl: './stats-dialog.html',
    styleUrl: './stats-dialog.scss',
    standalone: true,
    imports: [CommonModule],
    encapsulation: ViewEncapsulation.None
})
export class StatsDialog {
    @Input() isOpen = false;
    @Input() articleCount = 0;
    @Input() lastDate: Date | null = null;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }

    formatDate(date: Date | null): string {
        if (!date) return '—';
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}