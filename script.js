// ========================================
// ЗАДАНИЕ 8: Асинхронность и лоадер
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // === ЭЛЕМЕНТЫ ===
    const postFormOverlay = document.getElementById('post-form-overlay');
    const postForm = document.getElementById('post-form');
    const btnCreatePost = document.getElementById('btn-create-post');
    const btnShowStats = document.getElementById('btn-show-stats');
    const btnCloseStats = document.getElementById('btn-close-stats');
    const btnCancelForm = document.getElementById('btn-cancel-form');
    const btnCreateFirst = document.getElementById('btn-create-first');
    const statsDialog = document.getElementById('stats-dialog');
    const statsCount = document.getElementById('stats-count');
    const statsDate = document.getElementById('stats-date');
    const blogGrid = document.getElementById('blog-grid');
    const emptyState = document.getElementById('empty-state');
    const loaderContainer = document.getElementById('loader-container'); // Лоадер

    // Ключ для localStorage
    const STORAGE_KEY = 'blog_articles';

    // === ФУНКЦИИ УПРАВЛЕНИЯ ЛОАДЕРОМ ===

    // Показать лоадер
    function showLoader() {
        if (loaderContainer) {
            loaderContainer.classList.remove('hidden');
        }
    }

    // Скрыть лоадер
    function hideLoader() {
        if (loaderContainer) {
            loaderContainer.classList.add('hidden');
        }
    }

    // Заблокировать форму и кнопки
    function disableForm(disabled) {
        const submitBtn = postForm.querySelector('.btn-submit');
        const cancelBtn = postForm.querySelector('.btn-cancel');
        const inputs = postForm.querySelectorAll('input, textarea');

        if (submitBtn) submitBtn.disabled = disabled;
        if (cancelBtn) cancelBtn.disabled = disabled;

        inputs.forEach(input => {
            input.disabled = disabled;
        });

        // Добавляем класс для визуального эффекта
        if (disabled) {
            postForm.classList.add('loading');
        } else {
            postForm.classList.remove('loading');
        }
    }

    // Имитация асинхронной загрузки (Promise)
    function simulateAsyncLoad(delay = 1500) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    }

    // === ФУНКЦИИ РАБОТЫ С ДАННЫМИ ===

    // Загрузить статьи из localStorage
    function loadArticles() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Сохранить статьи в localStorage
    function saveArticles(articles) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    }

    // Получить дату последней статьи
    function getLastArticleDate(articles) {
        if (articles.length === 0) return '—';

        const firstArticle = articles[0];
        if (firstArticle.date) {
            return formatDate(new Date(firstArticle.date));
        }
        return formatDate(new Date());
    }

    // Отрисовать статьи в сетке
    async function renderArticles() {
        // Показываем лоадер
        showLoader();

        // Имитируем задержку загрузки (1.5 секунды)
        await simulateAsyncLoad(1500);

        const articles = loadArticles();

        // Удаляем все карточки, кроме empty-state и loader
        const existingCards = blogGrid.querySelectorAll('.article-card');
        existingCards.forEach(card => card.remove());

        // Показываем/скрываем пустое состояние
        if (articles.length === 0) {
            emptyState.hidden = false;
        } else {
            emptyState.hidden = true;

            // Рендерим статьи (первая — самая новая)
            articles.forEach((article, index) => {
                const card = createArticleCard(article);

                // Первая статья в массиве — самая новая, вставляем в начало
                if (index === 0) {
                    blogGrid.insertBefore(card, emptyState);
                } else {
                    blogGrid.appendChild(card);
                }
            });
        }

        // Обновляем статистику
        updateStats(articles);

        // Скрываем лоадер
        hideLoader();
    }

    // Создать HTML-элемент карточки
    function createArticleCard(article) {
        const card = document.createElement('article');
        card.className = 'article-card';
        card.dataset.id = article.id;

        card.innerHTML = `
            <button class="delete-btn" title="Удалить статью">&times;</button>
            <h2>${escapeHtml(article.title)}</h2>
            <p class="article-date"><strong>Опубликовано:</strong> <time datetime="${article.date}">${formatDate(new Date(article.date))}</time></p>
            <p>${escapeHtml(article.content)}</p>
        `;

        return card;
    }

    // Добавить новую статью
    async function addPost(title, content) {
        // Блокируем форму
        disableForm(true);

        // Показываем лоадер (опционально, можно убрать)
        showLoader();

        // Имитируем задержку сохранения (1 секунда)
        await simulateAsyncLoad(1000);

        const articles = loadArticles();

        const newArticle = {
            id: Date.now().toString(),
            title: title.trim(),
            content: content.trim(),
            date: getLocalDateString()
        };

        // Добавляем в начало массива (самая новая — первая)
        articles.unshift(newArticle);
        saveArticles(articles);

        // Перерисовываем
        await renderArticles();

        // Разблокируем форму
        disableForm(false);
    }

    // Удалить статью
    function deletePost(id) {
        let articles = loadArticles();
        articles = articles.filter(article => article.id !== id);
        saveArticles(articles);
        renderArticles();
    }

    // Получить локальную дату в формате YYYY-MM-DD
    function getLocalDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Обновить статистику
    function updateStats(articles) {
        if (statsCount) {
            statsCount.textContent = articles.length;
        }
        if (statsDate) {
            statsDate.textContent = getLastArticleDate(articles);
        }
    }

    // Показать/скрыть форму
    function toggleForm(show) {
        if (show) {
            postFormOverlay.classList.add('active');
            document.getElementById('post-title').focus();
        } else {
            postFormOverlay.classList.remove('active');
            postForm.reset();
        }
    }

    // Показать статистику
    function showStats() {
        const articles = loadArticles();
        updateStats(articles);
        statsDialog.showModal();
    }

    // Форматирование даты
    function formatDate(date) {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Экранирование HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // === ОБРАБОТЧИКИ СОБЫТИЙ ===

    // Инициализация: показываем лоадер и загружаем статьи
    renderArticles();

    // Кнопка "Создать статью"
    btnCreatePost?.addEventListener('click', () => toggleForm(true));

    // Кнопка "Создать первую статью" (из empty-state)
    btnCreateFirst?.addEventListener('click', () => toggleForm(true));

    // Кнопка "Отмена"
    btnCancelForm?.addEventListener('click', () => {
        postForm.reset();
        toggleForm(false);
    });

    // Отправка формы
    postForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('post-title').value.trim();
        const content = document.getElementById('post-content').value.trim();

        if (title && content) {
            await addPost(title, content);
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

    // Делегирование: удаление статьи
    blogGrid?.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const card = e.target.closest('.article-card');
            const id = card?.dataset.id;

            if (id && confirm('Удалить эту статью?')) {
                card.classList.add('removing');
                setTimeout(() => {
                    deletePost(id);
                }, 300);
            }
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