document.addEventListener('DOMContentLoaded', () => {
    // ================================
    // Configuração da API
    // ================================

    // URL do backend no HuggingFace Spaces
    const API_BASE_URL = 'https://madras1-stranddemo.hf.space';

    // Para testes locais, descomente:
    // const API_BASE_URL = 'http://localhost:7860';

    // ================================
    // Smooth scrolling for navigation links
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================
    // Navbar background change on scroll
    // ================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(10, 10, 18, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 18, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // ================================
    // Mobile menu toggle
    // ================================
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navUl = document.querySelector('nav ul');

    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', () => {
            const isDisplaying = navUl.style.display === 'flex';
            if (isDisplaying) {
                navUl.style.display = 'none';
            } else {
                navUl.style.display = 'flex';
                navUl.style.flexDirection = 'column';
                navUl.style.position = 'absolute';
                navUl.style.top = '70px';
                navUl.style.left = '0';
                navUl.style.width = '100%';
                navUl.style.backgroundColor = 'var(--dark-bg)';
                navUl.style.padding = '20px';
                navUl.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }

    // ================================
    // Contact Form submission
    // ================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Obrigado! Recebemos sua mensagem e entraremos em contato em breve.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // ================================
    // Demo Section Logic
    // ================================

    // Mode switching
    const modeBtns = document.querySelectorAll('.demo-mode-btn');
    const panels = document.querySelectorAll('.demo-panel');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;

            // Update buttons
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panels
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`panel-${mode}`).classList.add('active');
        });
    });

    // ================================
    // Quality Classification
    // ================================
    const qualityInput = document.getElementById('quality-input');
    const qualitySubmit = document.getElementById('quality-submit');
    const qualityResult = document.getElementById('quality-result');

    if (qualitySubmit) {
        qualitySubmit.addEventListener('click', async () => {
            const text = qualityInput.value.trim();
            if (!text) {
                alert('Por favor, insira um texto para analisar.');
                return;
            }

            setLoading(qualitySubmit, true);

            try {
                const response = await fetch(`${API_BASE_URL}/classify-quality`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });

                if (!response.ok) throw new Error('API error');

                const data = await response.json();
                displayQualityResult(data);
            } catch (error) {
                console.error('Error:', error);
                // Fallback: demo mode com resultado simulado
                const mockResult = simulateQualityClassification(text);
                displayQualityResult(mockResult);
            } finally {
                setLoading(qualitySubmit, false);
            }
        });
    }

    function displayQualityResult(data) {
        // Suporta tanto API real quanto fallback local
        const scorePercent = data.score_percent || Math.round(data.score);
        const similarity = data.similarity_score || data.score / 100;
        const threshold = data.threshold || 0.65;
        const verdict = data.verdict || '';

        // Determina classe CSS e texto do badge
        let badgeClass = data.quality;
        let badgeText = '';

        if (data.quality === 'high') {
            badgeText = '✨ Alta Qualidade';
        } else if (data.quality === 'medium') {
            badgeClass = 'medium';
            badgeText = '📝 Qualidade Média';
        } else {
            badgeText = '⚠️ Baixa Qualidade';
        }

        qualityResult.innerHTML = `
            <div class="quality-result-content">
                <div class="quality-badge ${badgeClass}">
                    ${badgeText}
                </div>
                <div class="quality-score">
                    <div class="quality-score-bar">
                        <div class="quality-score-fill" style="width: ${scorePercent}%"></div>
                    </div>
                    <p class="quality-score-text">
                        Similaridade com âncora de qualidade: <strong>${scorePercent.toFixed(1)}%</strong>
                    </p>
                </div>
                ${verdict ? `<p style="margin-top: 15px; font-size: 0.95rem;">${verdict}</p>` : ''}
                <p style="margin-top: 10px; font-size: 0.8rem; color: var(--text-muted);">
                    Threshold: ${(threshold * 100).toFixed(0)}% | Score: ${(similarity).toFixed(4)}
                </p>
            </div>
        `;
    }

    // Simulação local quando API não está disponível
    function simulateQualityClassification(text) {
        // Heurísticas simples para demo
        const words = text.split(/\s+/).length;
        const hasNumbers = /\d/.test(text);
        const hasTechnicalTerms = /(algoritmo|modelo|dados|análise|método|estudo|pesquisa|sistema)/i.test(text);
        const hasProperPunctuation = /[.!?]/.test(text);
        const avgWordLength = text.length / words;

        let score = 50;
        if (words > 20) score += 10;
        if (hasNumbers) score += 5;
        if (hasTechnicalTerms) score += 15;
        if (hasProperPunctuation) score += 10;
        if (avgWordLength > 5) score += 10;

        score = Math.min(100, Math.max(0, score));

        return {
            quality: score >= 50 ? 'high' : 'low',
            score: score,
            high_similarity: score / 100,
            low_similarity: (100 - score) / 100
        };
    }

    // ================================
    // Q&A
    // ================================
    const qaContext = document.getElementById('qa-context');
    const qaQuestion = document.getElementById('qa-question');
    const qaSubmit = document.getElementById('qa-submit');
    const qaResult = document.getElementById('qa-result');

    if (qaSubmit) {
        qaSubmit.addEventListener('click', async () => {
            const context = qaContext.value.trim();
            const question = qaQuestion.value.trim();

            if (!context || !question) {
                alert('Por favor, insira o texto e uma pergunta.');
                return;
            }

            setLoading(qaSubmit, true);

            try {
                const response = await fetch(`${API_BASE_URL}/qa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ context, question })
                });

                if (!response.ok) throw new Error('API error');

                const data = await response.json();
                displayQAResult(data.answer);
            } catch (error) {
                console.error('Error:', error);
                // Fallback message
                displayQAResult('🔌 API não disponível no momento. Por favor, tente novamente mais tarde ou entre em contato para uma demonstração ao vivo.');
            } finally {
                setLoading(qaSubmit, false);
            }
        });
    }

    function displayQAResult(answer) {
        qaResult.innerHTML = `
            <div class="qa-result-content">
                <p class="qa-answer">${answer}</p>
            </div>
        `;
    }

    // ================================
    // Image Captioning
    // ================================
    const imageDropZone = document.getElementById('image-drop-zone');
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const captionSubmit = document.getElementById('caption-submit');
    const captionResult = document.getElementById('caption-result');

    let currentImageBase64 = null;

    if (imageDropZone) {
        // Click to select
        imageDropZone.addEventListener('click', () => {
            imageInput.click();
        });

        // Drag and drop
        imageDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageDropZone.classList.add('drag-over');
        });

        imageDropZone.addEventListener('dragleave', () => {
            imageDropZone.classList.remove('drag-over');
        });

        imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageDropZone.classList.remove('drag-over');

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImageFile(file);
            }
        });

        // File input change
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageFile(file);
            }
        });
    }

    function handleImageFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            currentImageBase64 = dataUrl.split(',')[1]; // Remove data:image/xxx;base64, prefix

            imagePreview.src = dataUrl;
            imagePreview.hidden = false;
            imageDropZone.classList.add('has-image');
            captionSubmit.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    if (captionSubmit) {
        captionSubmit.addEventListener('click', async () => {
            if (!currentImageBase64) {
                alert('Por favor, selecione uma imagem.');
                return;
            }

            setLoading(captionSubmit, true);

            try {
                const response = await fetch(`${API_BASE_URL}/caption`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image_base64: currentImageBase64 })
                });

                if (!response.ok) throw new Error('API error');

                const data = await response.json();
                displayCaptionResult(data.caption);
            } catch (error) {
                console.error('Error:', error);
                // Fallback message
                displayCaptionResult('🔌 API de visão não disponível no momento. Por favor, tente novamente mais tarde.');
            } finally {
                setLoading(captionSubmit, false);
            }
        });
    }

    function displayCaptionResult(caption) {
        captionResult.innerHTML = `
            <div class="caption-result-content">
                <p class="caption-text">"${caption}"</p>
            </div>
        `;
    }

    // ================================
    // Utility Functions
    // ================================
    function setLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.querySelector('i').className = 'fas fa-spinner';
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            // Restore original icon based on button id
            const iconMap = {
                'quality-submit': 'fa-bolt',
                'qa-submit': 'fa-paper-plane',
                'caption-submit': 'fa-magic'
            };
            button.querySelector('i').className = `fas ${iconMap[button.id] || 'fa-check'}`;
            button.disabled = false;
        }
    }
});
