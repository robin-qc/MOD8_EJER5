/**
 * 🎨 ColorLab - Generador Interactivo de Colores
 * Versión profesional con enfoque educativo y visual
 */

class ColorLab {
    constructor() {
        // Inicializar estado de la aplicación
        this.state = {
            currentColor: '#667eea',
            isLocked: false,
            colorHistory: [],
            favorites: [],
            currentTab: 'generator',
            theme: 'light',
            soundEnabled: true,
            colorNames: this.loadColorNames(),
            dailyTips: this.getDailyTips(),
            userStats: this.loadUserStats(),
            particles: []
        };

        // Cache de elementos DOM
        this.elements = this.cacheDOM();
        
        // Inicializar la aplicación
        this.init();
    }

    /**
     * Cachear elementos DOM importantes
     */
    cacheDOM() {
        return {
            // Elementos principales
            body: document.body,
            colorPreview: document.getElementById('colorPreview'),
            currentHex: document.getElementById('currentHex'),
            colorName: document.getElementById('colorName'),
            
            // Botones principales
            generateRandom: document.getElementById('generateRandom'),
            generateVibrant: document.getElementById('generateVibrant'),
            generatePastel: document.getElementById('generatePastel'),
            likeColor: document.getElementById('likeColor'),
            lockColor: document.getElementById('lockColor'),
            
            // Controles deslizantes
            hueRange: document.getElementById('hueRange'),
            saturationRange: document.getElementById('saturationRange'),
            lightnessRange: document.getElementById('lightnessRange'),
            hueValue: document.getElementById('hueValue'),
            saturationValue: document.getElementById('saturationValue'),
            lightnessValue: document.getElementById('lightnessValue'),
            
            // Valores de color
            hexValue: document.getElementById('hexValue'),
            rgbValue: document.getElementById('rgbValue'),
            hslValue: document.getElementById('hslValue'),
            cmykValue: document.getElementById('cmykValue'),
            redValue: document.getElementById('redValue'),
            greenValue: document.getElementById('greenValue'),
            blueValue: document.getElementById('blueValue'),
            hueComponent: document.getElementById('hueComponent'),
            saturationComponent: document.getElementById('saturationComponent'),
            lightnessComponent: document.getElementById('lightnessComponent'),
            
            // Pestañas
            navTabs: document.querySelectorAll('.nav-tab'),
            tabContents: document.querySelectorAll('.tab-content'),
            
            // Historial
            historyGrid: document.getElementById('historyGrid'),
            totalColors: document.getElementById('totalColors'),
            favoriteColors: document.getElementById('favoriteColors'),
            lastGenerated: document.getElementById('lastGenerated'),
            clearAllHistory: document.getElementById('clearAllHistory'),
            exportHistory: document.getElementById('exportHistory'),
            
            // Notificaciones
            notification: document.getElementById('notification'),
            notificationMessage: document.getElementById('notificationMessage'),
            
            // Panel de información
            dailyTip: document.getElementById('dailyTip'),
            totalGenerated: document.getElementById('totalGenerated'),
            
            // Controles de tema y sonido
            themeToggle: document.getElementById('themeToggle'),
            soundToggle: document.getElementById('soundToggle'),
            
            // Partículas
            particlesContainer: document.getElementById('particles'),
            
            // Elementos relacionados
            relatedColors: document.querySelectorAll('.related-color')
        };
    }

    /**
     * Inicializar la aplicación
     */
    init() {
        // Cargar datos guardados
        this.loadSavedData();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Configurar atajos de teclado
        this.setupKeyboardShortcuts();
        
        // Configurar efectos visuales
        this.setupVisualEffects();
        
        // Aplicar color inicial
        this.applyColor(this.state.currentColor);
        
        // Actualizar UI
        this.updateUI();
        
        // Iniciar efectos de partículas
        this.initParticles();
        
        // Mostrar tip del día
        this.showDailyTip();
        
        console.log('🎨 ColorLab inicializado correctamente');
    }

    /**
     * Cargar datos guardados
     */
    loadSavedData() {
        try {
            const savedHistory = localStorage.getItem('colorlab_history');
            const savedFavorites = localStorage.getItem('colorlab_favorites');
            const savedStats = localStorage.getItem('colorlab_stats');
            const savedTheme = localStorage.getItem('colorlab_theme');
            
            if (savedHistory) this.state.colorHistory = JSON.parse(savedHistory);
            if (savedFavorites) this.state.favorites = JSON.parse(savedFavorites);
            if (savedStats) this.state.userStats = JSON.parse(savedStats);
            if (savedTheme) {
                this.state.theme = savedTheme;
                this.applyTheme(savedTheme);
            }
        } catch (error) {
            console.error('Error cargando datos guardados:', error);
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Botones de generación
        this.elements.generateRandom.addEventListener('click', () => this.generateRandomColor());
        this.elements.generateVibrant.addEventListener('click', () => this.generateVibrantColor());
        this.elements.generatePastel.addEventListener('click', () => this.generatePastelColor());
        
        // Botones de acción
        this.elements.likeColor.addEventListener('click', () => this.toggleFavorite());
        this.elements.lockColor.addEventListener('click', () => this.toggleLock());
        
        // Controles deslizantes
        this.elements.hueRange.addEventListener('input', (e) => this.updateFromSliders('hue', e.target.value));
        this.elements.saturationRange.addEventListener('input', (e) => this.updateFromSliders('saturation', e.target.value));
        this.elements.lightnessRange.addEventListener('input', (e) => this.updateFromSliders('lightness', e.target.value));
        
        // Click en el código HEX para copiar
        this.elements.currentHex.parentElement.addEventListener('click', () => this.copyToClipboard());
        
        // Colores relacionados
        this.elements.relatedColors.forEach(color => {
            color.addEventListener('click', (e) => {
                const colorHex = e.currentTarget.dataset.color;
                this.applyColor(colorHex);
                this.showNotification('Color relacionado aplicado', 'success');
            });
        });
        
        // Navegación por pestañas
        this.elements.navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                this.switchTab(tabId);
            });
        });
        
        // Historial
        this.elements.clearAllHistory.addEventListener('click', () => this.clearHistory());
        this.elements.exportHistory.addEventListener('click', () => this.exportHistory());
        
        // Controles de tema y sonido
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.elements.soundToggle.addEventListener('click', () => this.toggleSound());
        
        // Doble click para generar nuevo color
        this.elements.colorPreview.addEventListener('dblclick', () => {
            if (!this.state.isLocked) {
                this.generateRandomColor();
            }
        });
        
        // Actualizar estadísticas diarias
        this.updateDailyStats();
    }

    /**
     * Configurar atajos de teclado
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignorar si el usuario está escribiendo
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            // Evitar comportamiento por defecto para atajos
            const shortcuts = {
                ' ': () => { e.preventDefault(); this.generateRandomColor(); },
                'c': () => this.copyToClipboard(),
                'f': () => this.toggleFavorite(),
                'l': () => this.toggleLock(),
                '1': () => this.switchTab('generator'),
                '2': () => this.switchTab('education'),
                '3': () => this.switchTab('palettes'),
                '4': () => this.switchTab('history'),
                'Escape': () => this.closeModals(),
                'ArrowLeft': () => this.adjustHue(-10),
                'ArrowRight': () => this.adjustHue(10),
                'ArrowUp': () => this.adjustLightness(5),
                'ArrowDown': () => this.adjustLightness(-5)
            };
            
            if (shortcuts[e.key]) {
                shortcuts[e.key]();
            }
        });
    }

    /**
     * Configurar efectos visuales
     */
    setupVisualEffects() {
        // Efecto de partículas al generar color
        this.elements.colorPreview.addEventListener('mouseenter', () => {
            this.createParticles(10, this.state.currentColor);
        });
        
        // Animación suave al cambiar pestañas
        this.elements.navTabs.forEach(tab => {
            tab.addEventListener('mouseenter', () => {
                tab.style.transform = 'translateY(-2px)';
            });
            
            tab.addEventListener('mouseleave', () => {
                tab.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Inicializar sistema de partículas
     */
    initParticles() {
        // Crear partículas iniciales
        for (let i = 0; i < 20; i++) {
            this.createParticle();
        }
        
        // Animación continua
        this.animateParticles();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 20 + 5;
        const x = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}%`;
        particle.style.background = this.getRandomColor();
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        this.elements.particlesContainer.appendChild(particle);
        this.state.particles.push({
            element: particle,
            x,
            y: 100,
            size,
            speed: Math.random() * 0.5 + 0.2
        });
    }

    animateParticles() {
        this.state.particles.forEach(particle => {
            particle.y -= particle.speed;
            
            if (particle.y < -10) {
                particle.y = 100;
                particle.x = Math.random() * 100;
                particle.element.style.background = this.getRandomColor();
            }
            
            particle.element.style.left = `${particle.x}%`;
            particle.element.style.top = `${particle.y}%`;
        });
        
        requestAnimationFrame(() => this.animateParticles());
    }

    createParticles(count, color) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const size = Math.random() * 10 + 2;
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 100 + 50;
                const x = Math.cos(angle) * distance + 150;
                const y = Math.sin(angle) * distance + 150;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.background = color;
                particle.style.opacity = 0.7;
                particle.style.boxShadow = `0 0 10px ${color}`;
                
                this.elements.colorPreview.appendChild(particle);
                
                // Animación
                const animation = particle.animate([
                    { transform: 'scale(0) translate(0, 0)', opacity: 0.7 },
                    { transform: `scale(1) translate(${Math.cos(angle + Math.PI) * 100}px, ${Math.sin(angle + Math.PI) * 100}px)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                });
                
                animation.onfinish = () => particle.remove();
            }, i * 50);
        }
    }

    /**
     * Generar color aleatorio
     */
    generateRandomColor() {
        if (this.state.isLocked) {
            this.showNotification('El color está bloqueado. Desbloquea para cambiar.', 'info');
            return;
        }
        
        // Método 1: Hexadecimal aleatorio
        const hex = '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
        
        this.applyColor(hex);
        this.playSound('generate');
        
        // Efecto visual
        this.elements.generateRandom.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            this.elements.generateRandom.style.animation = '';
        }, 500);
    }

    /**
     * Generar color vibrante
     */
    generateVibrantColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30 + 70); // 70-100%
        const lightness = Math.floor(Math.random() * 30 + 35); // 35-65%
        
        const hex = this.hslToHex(hue, saturation, lightness);
        this.applyColor(hex);
        this.playSound('vibrant');
    }

    /**
     * Generar color pastel
     */
    generatePastelColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30 + 30); // 30-60%
        const lightness = Math.floor(Math.random() * 20 + 70); // 70-90%
        
        const hex = this.hslToHex(hue, saturation, lightness);
        this.applyColor(hex);
        this.playSound('pastel');
    }

    /**
     * Aplicar un color a la interfaz
     */
    applyColor(hex) {
        this.state.currentColor = hex.toUpperCase();
        
        // Convertir a diferentes formatos
        const rgb = this.hexToRgb(hex);
        const hsl = this.hexToHsl(hex);
        const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);
        
        // Actualizar vista previa
        this.elements.colorPreview.style.background = hex;
        this.elements.currentHex.textContent = hex;
        
        // Actualizar nombre del color
        const colorName = this.getColorName(hex);
        this.elements.colorName.textContent = colorName;
        
        // Actualizar controles deslizantes
        this.elements.hueRange.value = hsl.h;
        this.elements.saturationRange.value = hsl.s;
        this.elements.lightnessRange.value = hsl.l;
        
        this.elements.hueValue.textContent = `${hsl.h}°`;
        this.elements.saturationValue.textContent = `${hsl.s}%`;
        this.elements.lightnessValue.textContent = `${hsl.l}%`;
        
        // Actualizar valores de formato
        this.elements.hexValue.textContent = hex;
        this.elements.rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.elements.hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        this.elements.cmykValue.textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
        
        // Actualizar componentes individuales
        this.elements.redValue.textContent = rgb.r;
        this.elements.greenValue.textContent = rgb.g;
        this.elements.blueValue.textContent = rgb.b;
        
        this.elements.hueComponent.textContent = `${hsl.h}°`;
        this.elements.saturationComponent.textContent = `${hsl.s}%`;
        this.elements.lightnessComponent.textContent = `${hsl.l}%`;
        
        // Actualizar colores relacionados
        this.updateRelatedColors(hex);
        
        // Agregar al historial
        this.addToHistory(hex);
        
        // Actualizar estadísticas
        this.updateStats('colorsGenerated');
        
        // Actualizar fondo del body con gradiente sutil
        const gradient = `linear-gradient(135deg, ${this.adjustBrightness(hex, -20)} 0%, ${hex} 50%, ${this.adjustBrightness(hex, 20)} 100%)`;
        this.elements.body.style.background = gradient;
        
        // Efecto visual
        this.createParticles(5, hex);
    }

    /**
     * Actualizar desde controles deslizantes
     */
    updateFromSliders(type, value) {
        if (this.state.isLocked) return;
        
        const hue = parseInt(this.elements.hueRange.value);
        const saturation = parseInt(this.elements.saturationRange.value);
        const lightness = parseInt(this.elements.lightnessRange.value);
        
        // Actualizar valores mostrados
        this.elements.hueValue.textContent = `${hue}°`;
        this.elements.saturationValue.textContent = `${saturation}%`;
        this.elements.lightnessValue.textContent = `${lightness}%`;
        
        // Generar nuevo color
        const hex = this.hslToHex(hue, saturation, lightness);
        this.applyColor(hex);
    }

    /**
     * Ajustar matiz
     */
    adjustHue(amount) {
        const currentHue = parseInt(this.elements.hueRange.value);
        let newHue = currentHue + amount;
        
        // Mantener dentro del rango 0-360
        if (newHue < 0) newHue = 360 + newHue;
        if (newHue > 360) newHue = newHue - 360;
        
        this.elements.hueRange.value = newHue;
        this.updateFromSliders('hue', newHue);
    }

    /**
     * Ajustar luminosidad
     */
    adjustLightness(amount) {
        const currentLightness = parseInt(this.elements.lightnessRange.value);
        let newLightness = currentLightness + amount;
        
        // Mantener dentro del rango 0-100
        newLightness = Math.max(0, Math.min(100, newLightness));
        
        this.elements.lightnessRange.value = newLightness;
        this.updateFromSliders('lightness', newLightness);
    }

    /**
     * Actualizar colores relacionados
     */
    updateRelatedColors(hex) {
        const hsl = this.hexToHsl(hex);
        
        // Colores más oscuro y más claro
        const darker = this.hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20));
        const lighter = this.hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 20));
        
        // Color complementario (opuesto en la rueda)
        const complementaryHue = (hsl.h + 180) % 360;
        const complementary = this.hslToHex(complementaryHue, hsl.s, hsl.l);
        
        // Color análogo (30 grados de diferencia)
        const analogousHue = (hsl.h + 30) % 360;
        const analogous = this.hslToHex(analogousHue, hsl.s, hsl.l);
        
        // Actualizar elementos
        const relatedColors = [darker, lighter, complementary, analogous];
        
        this.elements.relatedColors.forEach((element, index) => {
            const color = relatedColors[index];
            element.style.background = color;
            element.dataset.color = color;
            
            // Actualizar contraste del texto
            const contrast = this.getContrastColor(color);
            element.querySelector('.related-label').style.color = contrast;
        });
    }

    /**
     * Agregar color al historial
     */
    addToHistory(hex) {
        // Evitar duplicados consecutivos
        if (this.state.colorHistory[0] === hex) return;
        
        const historyItem = {
            hex,
            timestamp: new Date().toISOString(),
            name: this.getColorName(hex),
            favorite: false
        };
        
        this.state.colorHistory.unshift(historyItem);
        
        // Limitar a 50 elementos
        if (this.state.colorHistory.length > 50) {
            this.state.colorHistory.pop();
        }
        
        // Guardar en localStorage
        this.saveHistory();
        
        // Actualizar UI del historial
        this.updateHistoryUI();
    }

    /**
     * Actualizar UI del historial
     */
    updateHistoryUI() {
        this.elements.totalColors.textContent = this.state.colorHistory.length;
        this.elements.favoriteColors.textContent = this.state.favorites.length;
        
        // Actualizar último generado
        if (this.state.colorHistory.length > 0) {
            const last = this.state.colorHistory[0];
            const date = new Date(last.timestamp);
            const now = new Date();
            const diff = now - date;
            
            if (diff < 24 * 60 * 60 * 1000) {
                this.elements.lastGenerated.textContent = 'Hoy';
            } else if (diff < 48 * 60 * 60 * 1000) {
                this.elements.lastGenerated.textContent = 'Ayer';
            } else {
                this.elements.lastGenerated.textContent = date.toLocaleDateString();
            }
        }
        
        // Renderizar grid del historial
        this.renderHistoryGrid();
    }

    /**
     * Renderizar grid del historial
     */
    renderHistoryGrid() {
        this.elements.historyGrid.innerHTML = '';
        
        if (this.state.colorHistory.length === 0) {
            this.elements.historyGrid.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-palette empty-icon"></i>
                    <h3>Historial Vacío</h3>
                    <p>Comienza a generar colores para verlos aquí</p>
                </div>
            `;
            return;
        }
        
        this.state.colorHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.style.background = item.hex;
            historyItem.dataset.color = item.hex;
            historyItem.dataset.index = index;
            
            // Indicador de favorito
            if (item.favorite) {
                const favoriteIcon = document.createElement('div');
                favoriteIcon.className = 'history-favorite';
                favoriteIcon.innerHTML = '<i class="fas fa-heart"></i>';
                historyItem.appendChild(favoriteIcon);
            }
            
            historyItem.addEventListener('click', () => {
                this.applyColor(item.hex);
                this.showNotification(`Color ${item.name} aplicado`, 'success');
            });
            
            this.elements.historyGrid.appendChild(historyItem);
        });
    }

    /**
     * Alternar favorito
     */
    toggleFavorite() {
        const hex = this.state.currentColor;
        const index = this.state.favorites.indexOf(hex);
        
        if (index === -1) {
            // Agregar a favoritos
            this.state.favorites.push(hex);
            this.elements.likeColor.innerHTML = '<i class="fas fa-heart"></i><span>Quitar Favorito</span>';
            this.elements.likeColor.style.color = '#ef4444';
            this.showNotification('Color agregado a favoritos', 'success');
            this.playSound('favorite');
        } else {
            // Quitar de favoritos
            this.state.favorites.splice(index, 1);
            this.elements.likeColor.innerHTML = '<i class="fas fa-heart"></i><span>Agregar Favorito</span>';
            this.elements.likeColor.style.color = '';
            this.showNotification('Color quitado de favoritos', 'info');
        }
        
        // Actualizar en el historial
        const historyIndex = this.state.colorHistory.findIndex(item => item.hex === hex);
        if (historyIndex !== -1) {
            this.state.colorHistory[historyIndex].favorite = !this.state.colorHistory[historyIndex].favorite;
        }
        
        // Guardar cambios
        this.saveFavorites();
        this.saveHistory();
        this.updateHistoryUI();
    }

    /**
     * Alternar bloqueo
     */
    toggleLock() {
        this.state.isLocked = !this.state.isLocked;
        
        if (this.state.isLocked) {
            this.elements.lockColor.innerHTML = '<i class="fas fa-lock"></i><span>Desbloquear</span>';
            this.elements.lockColor.style.background = 'var(--danger-color)';
            this.elements.lockColor.style.color = 'white';
            this.showNotification('Color bloqueado', 'info');
            this.playSound('lock');
        } else {
            this.elements.lockColor.innerHTML = '<i class="fas fa-lock-open"></i><span>Bloquear</span>';
            this.elements.lockColor.style.background = '';
            this.elements.lockColor.style.color = '';
            this.showNotification('Color desbloqueado', 'info');
        }
    }

    /**
     * Cambiar pestaña
     */
    switchTab(tabId) {
        // Actualizar estado
        this.state.currentTab = tabId;
        
        // Actualizar pestañas activas
        this.elements.navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Mostrar contenido activo
        this.elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });
        
        // Efecto visual
        this.playSound('tabSwitch');
    }

    /**
     * Copiar al portapapeles
     */
    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.state.currentColor);
            this.showNotification('Color copiado al portapapeles', 'success');
            this.playSound('copy');
            
            // Efecto visual
            this.elements.currentHex.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                this.elements.currentHex.style.animation = '';
            }, 500);
        } catch (error) {
            // Fallback para navegadores antiguos
            const textArea = document.createElement('textarea');
            textArea.value = this.state.currentColor;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showNotification('Color copiado al portapapeles', 'success');
            this.playSound('copy');
        }
    }

    /**
     * Limpiar historial
     */
    clearHistory() {
        if (this.state.colorHistory.length === 0) {
            this.showNotification('El historial ya está vacío', 'info');
            return;
        }
        
        if (confirm('¿Estás seguro de que quieres limpiar todo el historial?')) {
            this.state.colorHistory = [];
            this.saveHistory();
            this.updateHistoryUI();
            this.showNotification('Historial limpiado', 'success');
            this.playSound('clear');
        }
    }

    /**
     * Exportar historial
     */
    exportHistory() {
        if (this.state.colorHistory.length === 0) {
            this.showNotification('No hay colores para exportar', 'info');
            return;
        }
        
        const data = {
            exportedAt: new Date().toISOString(),
            totalColors: this.state.colorHistory.length,
            colors: this.state.colorHistory
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `colores-colorlab-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Historial exportado como JSON', 'success');
    }

    /**
     * Alternar tema claro/oscuro
     */
    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.state.theme = newTheme;
        this.applyTheme(newTheme);
        localStorage.setItem('colorlab_theme', newTheme);
        
        this.elements.themeToggle.innerHTML = newTheme === 'light' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        this.showNotification(`Tema ${newTheme === 'light' ? 'claro' : 'oscuro'} activado`, 'info');
        this.playSound('theme');
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
    }

    /**
     * Alternar sonido
     */
    toggleSound() {
        this.state.soundEnabled = !this.state.soundEnabled;
        
        if (this.state.soundEnabled) {
            this.elements.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.showNotification('Sonidos activados', 'info');
        } else {
            this.elements.soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.showNotification('Sonidos desactivados', 'info');
        }
    }

    /**
     * Reproducir sonido
     */
    playSound(type) {
        if (!this.state.soundEnabled) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Configurar según el tipo de sonido
        switch (type) {
            case 'generate':
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                break;
            case 'copy':
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Do5
                break;
            case 'favorite':
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // Mi5
                break;
            case 'lock':
                oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // Sol4
                break;
            default:
                oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
        }
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configurar envolvente
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    /**
     * Mostrar notificación
     */
    showNotification(message, type = 'info') {
        this.elements.notification.className = `notification ${type} show`;
        this.elements.notificationMessage.textContent = message;
        
        // Configurar icono según tipo
        const icon = this.elements.notification.querySelector('.notification-icon');
        icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 3000);
    }

    /**
     * Mostrar tip del día
     */
    showDailyTip() {
        const today = new Date().getDate();
        const tipIndex = today % this.state.dailyTips.length;
        this.elements.dailyTip.textContent = this.state.dailyTips[tipIndex];
    }

    /**
     * Actualizar estadísticas
     */
    updateStats(stat) {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.state.userStats[today]) {
            this.state.userStats[today] = {
                colorsGenerated: 0,
                favoritesAdded: 0,
                colorsCopied: 0
            };
        }
        
        this.state.userStats[today][stat]++;
        
        // Guardar estadísticas
        localStorage.setItem('colorlab_stats', JSON.stringify(this.state.userStats));
        
        // Actualizar contador total
        this.updateTotalGenerated();
    }

    updateDailyStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayStats = this.state.userStats[today] || { colorsGenerated: 0 };
        this.elements.totalGenerated.textContent = todayStats.colorsGenerated;
    }

    updateTotalGenerated() {
        const today = new Date().toISOString().split('T')[0];
        const todayStats = this.state.userStats[today] || { colorsGenerated: 0 };
        this.elements.totalGenerated.textContent = todayStats.colorsGenerated;
    }

    /**
     * Cerrar modales
     */
    closeModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => modal.classList.remove('show'));
    }

    /**
     * Actualizar UI completa
     */
    updateUI() {
        // Actualizar botón de favoritos
        const isFavorite = this.state.favorites.includes(this.state.currentColor);
        this.elements.likeColor.innerHTML = isFavorite 
            ? '<i class="fas fa-heart"></i><span>Quitar Favorito</span>'
            : '<i class="fas fa-heart"></i><span>Agregar Favorito</span>';
        
        if (isFavorite) {
            this.elements.likeColor.style.color = '#ef4444';
        } else {
            this.elements.likeColor.style.color = '';
        }
        
        // Actualizar botón de bloqueo
        this.elements.lockColor.innerHTML = this.state.isLocked
            ? '<i class="fas fa-lock"></i><span>Desbloquear</span>'
            : '<i class="fas fa-lock-open"></i><span>Bloquear</span>';
        
        if (this.state.isLocked) {
            this.elements.lockColor.style.background = 'var(--danger-color)';
            this.elements.lockColor.style.color = 'white';
        } else {
            this.elements.lockColor.style.background = '';
            this.elements.lockColor.style.color = '';
        }
        
        // Actualizar historial
        this.updateHistoryUI();
        
        // Actualizar estadísticas
        this.updateDailyStats();
    }

    /**
     * Guardar datos en localStorage
     */
    saveHistory() {
        localStorage.setItem('colorlab_history', JSON.stringify(this.state.colorHistory));
    }

    saveFavorites() {
        localStorage.setItem('colorlab_favorites', JSON.stringify(this.state.favorites));
    }

    loadUserStats() {
        try {
            const stats = localStorage.getItem('colorlab_stats');
            return stats ? JSON.parse(stats) : {};
        } catch {
            return {};
        }
    }

    /**
     * FUNCIONES DE CONVERSIÓN DE COLOR
     */
    
    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    hexToHsl(hex) {
        let { r, g, b } = this.hexToRgb(hex);
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        return { h, s, l };
    }

    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }

    rgbToCmyk(r, g, b) {
        if (r === 0 && g === 0 && b === 0) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }
        
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        
        const k = Math.min(c, m, y);
        c = (c - k) / (1 - k);
        m = (m - k) / (1 - k);
        y = (y - k) / (1 - k);
        
        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }

    /**
     * FUNCIONES UTILITARIAS
     */
    
    getColorName(hex) {
        // Buscar nombre en la lista de colores conocidos
        for (const [name, color] of Object.entries(this.state.colorNames)) {
            if (color.toLowerCase() === hex.toLowerCase()) {
                return name;
            }
        }
        
        // Si no se encuentra, generar un nombre descriptivo
        const hsl = this.hexToHsl(hex);
        
        let hueName = '';
        if (hsl.h < 15) hueName = 'Rojo';
        else if (hsl.h < 45) hueName = 'Naranja';
        else if (hsl.h < 75) hueName = 'Amarillo';
        else if (hsl.h < 165) hueName = 'Verde';
        else if (hsl.h < 195) hueName = 'Cian';
        else if (hsl.h < 255) hueName = 'Azul';
        else if (hsl.h < 285) hueName = 'Violeta';
        else if (hsl.h < 315) hueName = 'Magenta';
        else hueName = 'Rojo';
        
        let saturationName = '';
        if (hsl.s < 20) saturationName = 'Apagado';
        else if (hsl.s < 40) saturationName = 'Suave';
        else if (hsl.s < 60) saturationName = '';
        else if (hsl.s < 80) saturationName = 'Vibrante';
        else saturationName = 'Intenso';
        
        let lightnessName = '';
        if (hsl.l < 20) lightnessName = 'Oscuro';
        else if (hsl.l < 40) lightnessName = '';
        else if (hsl.l < 60) lightnessName = '';
        else if (hsl.l < 80) lightnessName = 'Claro';
        else lightnessName = 'Pastel';
        
        const parts = [saturationName, hueName, lightnessName].filter(part => part !== '');
        return parts.join(' ') || 'Color Personalizado';
    }

    getContrastColor(hex) {
        const { r, g, b } = this.hexToRgb(hex);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    adjustBrightness(hex, amount) {
        let { r, g, b } = this.hexToRgb(hex);
        
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));
        
        return this.rgbToHex(r, g, b);
    }

    getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 60%)`;
    }

    loadColorNames() {
        return {
            'Rojo Intenso': '#FF0000',
            'Verde Esmeralda': '#50C878',
            'Azul Real': '#4169E1',
            'Amarillo Sol': '#FFD700',
            'Naranja Brillante': '#FFA500',
            'Púrpura Real': '#6A0DAD',
            'Rosa Fucsia': '#FF00FF',
            'Turquesa': '#40E0D0',
            'Coral': '#FF7F50',
            'Lavanda': '#E6E6FA',
            'Menta': '#98FF98',
            'Melocotón': '#FFDAB9',
            'Índigo': '#4B0082',
            'Oro': '#FFD700',
            'Plata': '#C0C0C0',
            'Bronce': '#CD7F32'
        };
    }

    getDailyTips() {
        return [
            'Los colores complementarios (opuestos en la rueda) crean alto contraste y dinamismo.',
            'Usa colores análogos (vecinos) para diseños armoniosos y relajantes.',
            'La regla 60-30-10: 60% color dominante, 30% secundario, 10% acento.',
            'Los colores cálidos (rojos, naranjas) avanzan visualmente, los fríos retroceden.',
            'Prueba esquemas monocromáticos usando diferentes tonos del mismo color.',
            'La accesibilidad es clave: asegura suficiente contraste entre texto y fondo.',
            'Los colores pastel (alta luminosidad, baja saturación) crean ambientes suaves.',
            'Experimenta con diferentes saturaciones para crear jerarquía visual.',
            'Los colores vibrantes atraen atención, úsalos para elementos importantes.',
            'Considera la psicología del color: azul para confianza, verde para naturaleza, etc.'
        ];
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar compatibilidad
    if (!CSS.supports('display', 'grid')) {
        alert('Tu navegador no es compatible con todas las funciones de ColorLab. Por favor, actualízalo.');
    }
    
    // Inicializar aplicación
    window.colorLab = new ColorLab();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        colorLab.showNotification('¡Bienvenido a ColorLab! Presiona ESPACIO para generar colores', 'info');
    }, 1000);
});