// ========================================
// ЗАДАНИЕ 6: Интерактивность блога
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // === ЭЛЕМЕНТЫ ===
    const postFormOverlay = document.getElementById('post-form-overlay');
    const postForm = document.getElementById('post-form');
    const btnCreatePost = document.getElementById('btn-create-post');
    const btnShowStats = document.getElementById('btn-show-stats');
    const btnCloseStats = document.getElementById('btn-close-stats');
    const btnCancelForm = document.getElementById('btn-cancel-form');
    const statsDialog = document.getElementById('stats-dialog');
    const statsCount = document.getElementById('stats-count');
    const statsDate = document.getElementById('stats-date');
    const blogGrid = document.querySelector('.blog-grid');

    // === ФУНКЦИИ ===

    // Показать/скрыть форму добавления статьи
    function toggleForm(show) {
        if (show) {
            postFormOverlay.classList.add('active');
            document.getElementById('post-title').focus();
        } else {
            postFormOverlay.classList.remove('active');
            postForm.reset();
        }
    }

    // Получить дату последней (самой новой) статьи
    function getLastArticleDate() {
        const articles = document.querySelectorAll('.article-card');
        if (articles.length === 0) {
            return '—';
        }

        // Берём первую статью (самую новую)
        const firstArticle = articles[0];
        const timeElement = firstArticle.querySelector('time');

        if (timeElement && timeElement.dateTime) {
            return formatDate(new Date(timeElement.dateTime));
        }

        return formatDate(new Date());
    }

    // Показать статистику
    function showStats() {
        const articles = document.querySelectorAll('.article-card');

        // Обновляем количество
        if (statsCount) {
            statsCount.textContent = articles.length;
        }

        // Обновляем дату последней статьи
        if (statsDate) {
            statsDate.textContent = getLastArticleDate();
        }

        statsDialog.showModal();
    }

    // Обновить статистику (количество + дата)
    function updateStatsCount() {
        const articles = document.querySelectorAll('.article-card');

        if (statsCount) {
            statsCount.textContent = articles.length;
        }

        // Обновляем дату автоматически
        if (statsDate) {
            statsDate.textContent = getLastArticleDate();
        }
    }

    // Добавить новую статью (с данными из формы)
    function addPost(title, content) {
        const article = document.createElement('article');
        const now = new Date();

        // Получаем локальную дату (не UTC!)
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        article.className = 'article-card';
        article.innerHTML = `
            <button class="delete-btn" title="Удалить статью">&times;</button>
            <h2>${escapeHtml(title)}</h2>
            <p class="article-date"><strong>Опубликовано:</strong> <time datetime="${dateStr}">${formatDate(now)}</time></p>
            <p>${escapeHtml(content)}</p>
        `;

        // Вставляем новую статью первой в сетку
        blogGrid.insertBefore(article, blogGrid.firstChild);

        // Обновляем статистику
        updateStatsCount();
    }

    // Удалить статью
    function handleDelete(event) {
        const card = event.target.closest('.article-card');
        if (card && confirm('Удалить эту статью?')) {
            // Добавляем класс для анимации
            card.classList.add('removing');

            // Ждём завершения анимации и удаляем
            setTimeout(() => {
                card.remove();
                // Обновляем статистику (включая дату!)
                updateStatsCount();
            }, 300);
        }
    }

    // Форматирование даты
    function formatDate(date) {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Экранирование HTML (защита от XSS)
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // === ОБРАБОТЧИКИ СОБЫТИЙ ===

    // Кнопка "Создать статью"
    btnCreatePost?.addEventListener('click', () => toggleForm(true));

    // Кнопка "Отмена" - очистка и скрытие формы
    btnCancelForm?.addEventListener('click', () => {
        postForm.reset();
        toggleForm(false);
    });

    // Отправка формы - чтение данных и добавление статьи
    postForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Чтение данных из формы
        const title = document.getElementById('post-title').value.trim();
        const content = document.getElementById('post-content').value.trim();

        // Валидация
        if (title && content) {
            addPost(title, content);
            postForm.reset();
            toggleForm(false);
        } else {
            alert('Пожалуйста, заполните все поля!');
        }
    });

    // Кнопка "Статистика"
    btnShowStats?.addEventListener('click', showStats);

    // Закрытие статистики
    btnCloseStats?.addEventListener('click', () => statsDialog.close());

    // Закрытие по клику вне dialog
    statsDialog?.addEventListener('click', (e) => {
        if (e.target === statsDialog) {
            statsDialog.close();
        }
    });

    // ДЕЛЕГИРОВАНИЕ СОБЫТИЙ: один обработчик на весь контейнер
    blogGrid?.addEventListener('click', (e) => {
        // Проверяем, кликнули ли на кнопку удаления
        if (e.target.classList.contains('delete-btn')) {
            handleDelete(e);
        }
    });

    // Закрытие формы по клику вне неё
    postFormOverlay?.addEventListener('click', (e) => {
        if (e.target === postFormOverlay) {
            toggleForm(false);
        }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleForm(false);
            statsDialog?.close();
        }
    });
});