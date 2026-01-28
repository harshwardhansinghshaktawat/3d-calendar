class HolidayCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.holidays = [];
        this.currentDate = new Date();
        this.language = 'en';
        this.options = {
            firstDayOfWeek: 0,
            showWeekNumbers: true,
            countryCode: 'US',
            language: 'en',
            colors: {
                primary: '#3498db',
                secondary: '#2ecc71',
                background: '#ffffff',
                text: '#2c3e50',
                border: '#ecf0f1',
                holiday: '#e74c3c'
            },
            typography: {
                fontFamily: 'Arial, sans-serif',
                headerFontSize: 16
            },
            layout: {
                cellPadding: 8,
                borderRadius: 8
            },
            display: {
                highlightWeekends: true,
                showMoonPhases: false
            },
            navigation: {
                showNavigationButtons: true,
                showTodayButton: true
            }
        };
        
        // Localization data
        this.translations = {
            en: {
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                today: 'Today',
                week: 'Wk',
                publicHoliday: 'Public Holiday',
                previous: 'Previous',
                next: 'Next'
            },
            de: {
                months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                daysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                today: 'Heute',
                week: 'Woche',
                publicHoliday: 'Feiertag',
                previous: 'Zurück',
                next: 'Weiter'
            },
            fr: {
                months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                daysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                today: 'Aujourd\'hui',
                week: 'Sem',
                publicHoliday: 'Jour férié',
                previous: 'Précédent',
                next: 'Suivant'
            },
            es: {
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                today: 'Hoy',
                week: 'Sem',
                publicHoliday: 'Día festivo',
                previous: 'Anterior',
                next: 'Siguiente'
            },
            pt: {
                months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
                daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                today: 'Hoje',
                week: 'Sem',
                publicHoliday: 'Feriado',
                previous: 'Anterior',
                next: 'Próximo'
            },
            it: {
                months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                days: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
                daysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
                today: 'Oggi',
                week: 'Sett',
                publicHoliday: 'Festività',
                previous: 'Precedente',
                next: 'Successivo'
            },
            ru: {
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                today: 'Сегодня',
                week: 'Нед',
                publicHoliday: 'Государственный праздник',
                previous: 'Назад',
                next: 'Вперед'
            },
            ja: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                days: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
                daysShort: ['日', '月', '火', '水', '木', '金', '土'],
                today: '今日',
                week: '週',
                publicHoliday: '祝日',
                previous: '前',
                next: '次'
            },
            zh: {
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                daysShort: ['日', '一', '二', '三', '四', '五', '六'],
                today: '今天',
                week: '周',
                publicHoliday: '公共假期',
                previous: '上一个',
                next: '下一个'
            },
            ko: {
                months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                days: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
                daysShort: ['일', '월', '화', '수', '목', '금', '토'],
                today: '오늘',
                week: '주',
                publicHoliday: '공휴일',
                previous: '이전',
                next: '다음'
            },
            ar: {
                months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                monthsShort: ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'],
                days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                daysShort: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
                today: 'اليوم',
                week: 'أسبوع',
                publicHoliday: 'عطلة رسمية',
                previous: 'السابق',
                next: 'التالي'
            },
            vi: {
                months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                monthsShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
                days: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
                daysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                today: 'Hôm nay',
                week: 'Tuần',
                publicHoliday: 'Ngày lễ',
                previous: 'Trước',
                next: 'Tiếp theo'
            },
            id: {
                months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
                monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
                days: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
                daysShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                today: 'Hari ini',
                week: 'Minggu',
                publicHoliday: 'Hari libur',
                previous: 'Sebelumnya',
                next: 'Berikutnya'
            }
        };
    }
    
    static get observedAttributes() {
        return ['holidays-data', 'calendar-options'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'holidays-data' && newValue) {
            try {
                this.holidays = JSON.parse(newValue);
                console.log('✅ Holidays loaded:', this.holidays.length);
                this.render();
            } catch (e) {
                console.error('Error parsing holidays data:', e);
            }
        } else if (name === 'calendar-options' && newValue) {
            try {
                const newOptions = JSON.parse(newValue);
                this.options = this.deepMerge(this.options, newOptions);
                this.language = this.options.language || 'en';
                this.render();
            } catch (e) {
                console.error('Error parsing calendar options:', e);
            }
        }
    }

    deepMerge(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    connectedCallback() {
        this.render();
    }
    
    t(key) {
        const lang = this.translations[this.language] || this.translations['en'];
        return lang[key] || this.translations['en'][key] || key;
    }

    render() {
        const { colors, typography, layout, navigation } = this.options;
        
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Noto+Sans:wght@300;400;600;700&display=swap');
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                :host {
                    display: block;
                    width: 100%;
                    font-family: ${typography.fontFamily};
                    color: ${colors.text};
                }

                .calendar-container {
                    background: ${colors.background};
                    border-radius: ${layout.borderRadius}px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    min-height: 500px;
                    height: auto;
                    position: relative;
                }

                .calendar-header {
                    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    flex-shrink: 0;
                }

                .header-title {
                    font-size: ${typography.headerFontSize + 4}px;
                    font-weight: bold;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .header-controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .nav-button, .today-button {
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-family: ${typography.fontFamily};
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .nav-button:hover, .today-button:hover {
                    background: rgba(255, 255, 255, 0.35);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                .nav-button:active, .today-button:active {
                    transform: translateY(0);
                }

                .calendar-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    scrollbar-width: thin;
                    scrollbar-color: ${colors.primary} ${colors.border};
                }

                .calendar-body::-webkit-scrollbar {
                    width: 8px;
                }

                .calendar-body::-webkit-scrollbar-track {
                    background: ${colors.border};
                    border-radius: 4px;
                }

                .calendar-body::-webkit-scrollbar-thumb {
                    background: ${colors.primary};
                    border-radius: 4px;
                }

                /* Month View Styles */
                .month-view {
                    display: grid;
                    grid-template-columns: ${this.options.showWeekNumbers ? '50px ' : ''}repeat(7, 1fr);
                    gap: 2px;
                    background: ${colors.border};
                    border: 1px solid ${colors.border};
                    border-radius: 8px;
                    overflow: hidden;
                }

                .day-header, .week-number {
                    background: ${colors.primary};
                    color: white;
                    padding: 12px 8px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .week-number {
                    background: ${colors.secondary};
                    font-weight: 700;
                }

                .day-cell {
                    background: white;
                    min-height: 100px;
                    padding: ${layout.cellPadding}px;
                    position: relative;
                    transition: all 0.3s ease;
                    overflow: visible;
                    display: flex;
                    flex-direction: column;
                }

                .day-cell.other-month {
                    opacity: 0.4;
                    background: #f9f9f9;
                }

                .day-cell.today {
                    border: 3px solid ${colors.primary};
                    background: rgba(52, 152, 219, 0.1);
                    box-shadow: inset 0 0 0 1px ${colors.primary};
                }

                .day-cell.weekend {
                    background: ${this.options.display.highlightWeekends ? 'rgba(52, 152, 219, 0.05)' : 'white'};
                }

                .day-cell.holiday {
                    background: linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(231, 76, 60, 0.05));
                }

                .day-number {
                    font-weight: 700;
                    font-size: 16px;
                    margin-bottom: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .moon-phase {
                    font-size: 16px;
                    opacity: 0.7;
                }

                .holiday-indicator {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 10px;
                    height: 10px;
                    background: ${colors.holiday};
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.3); opacity: 0.7; }
                }

                .holiday-badge {
                    background: ${colors.holiday};
                    color: white;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    margin-top: 4px;
                    white-space: normal;
                    word-wrap: break-word;
                    line-height: 1.3;
                    box-shadow: 0 2px 6px rgba(231, 76, 60, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .holiday-icon {
                    font-size: 14px;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .calendar-header {
                        flex-direction: column;
                        align-items: stretch;
                        padding: 16px;
                    }

                    .header-controls {
                        justify-content: center;
                        flex-wrap: wrap;
                    }

                    .month-view {
                        grid-template-columns: repeat(7, 1fr);
                        gap: 1px;
                    }

                    .day-cell {
                        min-height: 80px;
                        padding: 4px;
                    }

                    .nav-button, .today-button {
                        padding: 6px 12px;
                        font-size: 12px;
                    }

                    .day-number {
                        font-size: 14px;
                    }

                    .holiday-badge {
                        font-size: 10px;
                        padding: 4px 6px;
                    }
                }

                @media (max-width: 480px) {
                    .header-title {
                        font-size: ${typography.headerFontSize}px;
                    }

                    .day-number {
                        font-size: 12px;
                    }

                    .day-cell {
                        min-height: 70px;
                        padding: 2px;
                    }

                    .holiday-badge {
                        font-size: 9px;
                        padding: 3px 5px;
                    }
                }
            </style>

            <div class="calendar-container">
                <div class="calendar-header">
                    <h2 class="header-title">${this.getHeaderTitle()}</h2>
                    <div class="header-controls">
                        ${navigation.showNavigationButtons ? `
                            <button class="nav-button" id="prevBtn">◀ ${this.t('previous')}</button>
                            ${navigation.showTodayButton ? `<button class="today-button" id="todayBtn">${this.t('today')}</button>` : ''}
                            <button class="nav-button" id="nextBtn">${this.t('next')} ▶</button>
                        ` : ''}
                    </div>
                </div>
                <div class="calendar-body">
                    ${this.renderMonthView()}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    getHeaderTitle() {
        const months = this.t('months');
        return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const startDate = new Date(firstDay);
        const dayOfWeek = firstDay.getDay();
        const daysToSubtract = (dayOfWeek - this.options.firstDayOfWeek + 7) % 7;
        startDate.setDate(startDate.getDate() - daysToSubtract);

        const daysShort = this.t('daysShort');
        const reorderedDays = [...daysShort.slice(this.options.firstDayOfWeek), ...daysShort.slice(0, this.options.firstDayOfWeek)];

        let html = '<div class="month-view">';

        if (this.options.showWeekNumbers) {
            html += `<div class="week-number">${this.t('week')}</div>`;
        }

        reorderedDays.forEach(day => {
            html += `<div class="day-header">${day}</div>`;
        });

        let currentRenderDate = new Date(startDate);
        
        for (let week = 0; week < 6; week++) {
            if (this.options.showWeekNumbers) {
                const weekNumber = this.getWeekNumber(currentRenderDate);
                html += `<div class="week-number">${weekNumber}</div>`;
            }

            for (let day = 0; day < 7; day++) {
                const isToday = this.isSameDay(currentRenderDate, new Date());
                const isOtherMonth = currentRenderDate.getMonth() !== month;
                const isWeekend = currentRenderDate.getDay() === 0 || currentRenderDate.getDay() === 6;
                const dayHolidays = this.getHolidaysForDate(currentRenderDate);
                const isHoliday = dayHolidays.length > 0;
                const moonPhase = this.options.display.showMoonPhases ? this.getMoonPhase(currentRenderDate) : '';

                html += `
                    <div class="day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''} ${isHoliday ? 'holiday' : ''}">
                        ${isHoliday ? '<div class="holiday-indicator"></div>' : ''}
                        <div class="day-number">
                            <span>${currentRenderDate.getDate()}</span>
                            ${moonPhase ? `<span class="moon-phase">${moonPhase}</span>` : ''}
                        </div>
                        ${dayHolidays.map(holiday => 
                            `<div class="holiday-badge" title="${holiday.name}">
                                <span class="holiday-icon">🎉</span>
                                <span>${holiday.name}</span>
                            </div>`
                        ).join('')}
                    </div>
                `;

                currentRenderDate.setDate(currentRenderDate.getDate() + 1);
            }
        }

        html += '</div>';
        return html;
    }

    attachEventListeners() {
        const prevBtn = this.shadowRoot.getElementById('prevBtn');
        const nextBtn = this.shadowRoot.getElementById('nextBtn');
        const todayBtn = this.shadowRoot.getElementById('todayBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.navigate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigate(1));
        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());
    }

    navigate(direction) {
        const newDate = new Date(this.currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        this.currentDate = newDate;
        this.render();
    }

    goToToday() {
        this.currentDate = new Date();
        this.render();
    }

    getHolidaysForDate(date) {
        if (!this.holidays || this.holidays.length === 0) {
            return [];
        }
        
        const matchingHolidays = this.holidays.filter(holiday => {
            if (!holiday.date) {
                return false;
            }
            
            const holidayDate = new Date(holiday.date + 'T12:00:00');
            
            return this.isSameDay(holidayDate, date);
        });
        
        return matchingHolidays;
    }

    isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    getMoonPhase(date) {
        const knownNewMoon = new Date(2000, 0, 6, 18, 14);
        const daysSinceNew = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
        const phase = (daysSinceNew % 29.53059) / 29.53059;
        
        if (phase < 0.0625) return '🌑';
        if (phase < 0.1875) return '🌒';
        if (phase < 0.3125) return '🌓';
        if (phase < 0.4375) return '🌔';
        if (phase < 0.5625) return '🌕';
        if (phase < 0.6875) return '🌖';
        if (phase < 0.8125) return '🌗';
        if (phase < 0.9375) return '🌘';
        return '🌑';
    }
}

customElements.define('holiday-calendar', HolidayCalendar);
