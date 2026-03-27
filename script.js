// ========================================
// ЗАДАНИЕ 5: Интерактивность блога
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

    // Показать статистику
    function showStats() {
        const articles = document.querySelectorAll('.article-card');
        if (statsCount) {
            statsCount.textContent = articles.length;
        }
        statsDialog.showModal();
    }

    // Добавить новую статью (с mock-данными для задания 5)
    function addPost() {
        const article = document.createElement('article');
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];

        // Mock-данные (в задании 6 будем читать из формы)
        article.className = 'article-card';
        article.innerHTML = `
            <h2>Новая статья</h2>
            <p class="article-date"><strong>Опубликовано:</strong> <time datetime="${dateStr}">${formatDate(now)}</time></p>
            <p>Это пример новой статьи. В задании 6 данные будут браться из формы.</p>
        `;

        // Вставляем новую статью первой в сетку
        blogGrid.insertBefore(article, blogGrid.firstChild);
    }

    // Форматирование даты
    function formatDate(date) {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // === ОБРАБОТЧИКИ СОБЫТИЙ ===

    // Кнопка "Создать статью" - показываем форму
    btnCreatePost?.addEventListener('click', () => toggleForm(true));

    // Кнопка "Отмена" - скрываем форму
    btnCancelForm?.addEventListener('click', () => toggleForm(false));

    // Отправка формы - добавляем статью (в задании 5 с mock-данными)
    postForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        addPost();  // В задании 6 будем читать данные из формы
        toggleForm(false);
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