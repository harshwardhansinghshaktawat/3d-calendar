class AdvancedCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.events = [];
        this.holidays = [];
        this.currentDate = new Date();
        this.selectedDate = null;
        this.viewMode = 'month';
        this.options = {
            viewMode: 'month',
            firstDayOfWeek: 0,
            showWeekNumbers: true,
            showHolidays: true,
            countryCode: 'IN',
            colors: {
                primary: '#3498db',
                secondary: '#2ecc71',
                background: '#ffffff',
                text: '#2c3e50',
                border: '#ecf0f1',
                hover: '#e8f4f8',
                holiday: '#e74c3c'
            },
            typography: {
                fontFamily: 'Arial, sans-serif',
                headerFontSize: 16,
                eventFontSize: 14
            },
            layout: {
                cellPadding: 8,
                borderRadius: 8
            },
            display: {
                showEventTime: true,
                showEventCategory: true,
                enableHover: true,
                highlightWeekends: true,
                showMoonPhases: false
            },
            navigation: {
                showNavigationButtons: true,
                showTodayButton: true
            }
        };
    }

    static get observedAttributes() {
        return ['events-data', 'holidays-data', 'calendar-options'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'events-data' && newValue) {
            try {
                this.events = JSON.parse(newValue);
                this.render();
            } catch (e) {
                console.error('Error parsing events data:', e);
            }
        } else if (name === 'holidays-data' && newValue) {
            try {
                this.holidays = JSON.parse(newValue);
                console.log('Holidays loaded in custom element:', this.holidays.length);
                if (this.holidays.length > 0) {
                    console.log('First holiday:', this.holidays[0]);
                }
                this.render();
            } catch (e) {
                console.error('Error parsing holidays data:', e);
            }
        } else if (name === 'calendar-options' && newValue) {
            try {
                const newOptions = JSON.parse(newValue);
                this.options = this.deepMerge(this.options, newOptions);
                this.viewMode = this.options.viewMode;
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

    render() {
        const { colors, typography, layout, navigation } = this.options;
        
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&display=swap');
                
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
                    min-height: 600px;
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

                .nav-button, .today-button, .view-button {
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

                .nav-button:hover, .today-button:hover, .view-button:hover {
                    background: rgba(255, 255, 255, 0.35);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                .nav-button:active, .today-button:active, .view-button:active {
                    transform: translateY(0);
                }

                .view-button.active {
                    background: rgba(255, 255, 255, 0.5);
                    font-weight: 700;
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
                    font-size: ${typography.eventFontSize}px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .week-number {
                    background: ${colors.secondary};
                    font-weight: 700;
                }

                .day-cell {
                    background: white;
                    min-height: 120px;
                    padding: ${layout.cellPadding}px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .day-cell:hover {
                    background: ${this.options.display.enableHover ? colors.hover : 'white'};
                    transform: ${this.options.display.enableHover ? 'scale(1.02)' : 'none'};
                    box-shadow: ${this.options.display.enableHover ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
                    z-index: 10;
                }

                .day-cell.other-month {
                    opacity: 0.4;
                    background: #f9f9f9;
                }

                .day-cell.today {
                    border: 3px solid ${colors.primary};
                    background: ${colors.hover};
                    box-shadow: inset 0 0 0 1px ${colors.primary};
                }

                .day-cell.selected {
                    background: ${colors.primary};
                    color: white;
                }

                .day-cell.weekend {
                    background: ${this.options.display.highlightWeekends ? 'rgba(52, 152, 219, 0.05)' : 'white'};
                }

                .day-cell.holiday {
                    background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.05));
                }

                .day-number {
                    font-weight: 700;
                    font-size: ${typography.eventFontSize + 2}px;
                    margin-bottom: 6px;
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
                    width: 8px;
                    height: 8px;
                    background: ${colors.holiday};
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                }

                .holiday-name {
                    font-size: ${typography.eventFontSize - 3}px;
                    color: ${colors.holiday};
                    font-weight: 600;
                    margin-top: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .event-dot-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-top: 4px;
                }

                .event-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .event-item {
                    background: ${colors.primary};
                    color: white;
                    padding: 4px 8px;
                    margin-top: 4px;
                    border-radius: 4px;
                    font-size: ${typography.eventFontSize - 2}px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                }

                .event-item:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
                }

                /* Week View Styles */
                .week-view {
                    display: grid;
                    grid-template-columns: 80px repeat(7, 1fr);
                    gap: 1px;
                    background: ${colors.border};
                    border-radius: 8px;
                    overflow: hidden;
                }

                .time-slot {
                    background: white;
                    border: 1px solid ${colors.border};
                    padding: 8px;
                    font-size: ${typography.eventFontSize - 2}px;
                    text-align: center;
                    min-height: 50px;
                }

                .time-slot.header {
                    background: ${colors.primary};
                    color: white;
                    font-weight: 600;
                }

                /* Day View Styles */
                .day-view {
                    max-width: 900px;
                    margin: 0 auto;
                }

                .day-view-header {
                    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: ${typography.headerFontSize}px;
                    font-weight: 700;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .day-view-events {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding-bottom: 20px;
                }

                .day-event-card {
                    background: white;
                    border-left: 5px solid ${colors.primary};
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .day-event-card:hover {
                    transform: translateX(8px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
                }

                .day-event-card.holiday-card {
                    border-left-color: ${colors.holiday};
                    background: linear-gradient(to right, rgba(231, 76, 60, 0.05), white);
                }

                .event-title {
                    font-size: ${typography.eventFontSize + 4}px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    color: ${colors.text};
                }

                .event-time {
                    font-size: ${typography.eventFontSize}px;
                    color: ${colors.primary};
                    margin-bottom: 6px;
                    font-weight: 500;
                }

                .event-category {
                    display: inline-block;
                    background: ${colors.secondary};
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: ${typography.eventFontSize - 2}px;
                    margin-bottom: 10px;
                    font-weight: 500;
                }

                .event-description {
                    font-size: ${typography.eventFontSize}px;
                    color: #666;
                    line-height: 1.6;
                    margin-top: 8px;
                }

                .no-events {
                    text-align: center;
                    padding: 60px 20px;
                    color: #999;
                    font-size: ${typography.eventFontSize + 4}px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .no-events svg {
                    width: 80px;
                    height: 80px;
                    opacity: 0.3;
                    margin-bottom: 20px;
                }

                /* Event Modal/Popup */
                .event-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                    backdrop-filter: blur(4px);
                }

                .event-modal.show {
                    display: flex;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .modal-content {
                    background: white;
                    border-radius: 16px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.4s ease;
                    position: relative;
                }

                .modal-header {
                    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                    color: white;
                    padding: 24px;
                    border-radius: 16px 16px 0 0;
                    position: relative;
                }

                .modal-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 24px;
                    line-height: 1;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }

                .modal-title {
                    font-size: ${typography.headerFontSize + 4}px;
                    font-weight: 700;
                    margin: 0;
                    padding-right: 40px;
                }

                .modal-body {
                    padding: 24px;
                }

                .modal-section {
                    margin-bottom: 20px;
                }

                .modal-section-title {
                    font-size: ${typography.eventFontSize}px;
                    font-weight: 600;
                    color: ${colors.primary};
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .modal-section-content {
                    font-size: ${typography.eventFontSize + 1}px;
                    color: ${colors.text};
                    line-height: 1.6;
                }

                .modal-category-badge {
                    display: inline-block;
                    background: ${colors.secondary};
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: ${typography.eventFontSize}px;
                    font-weight: 500;
                }

                .modal-time-info {
                    background: ${colors.hover};
                    padding: 16px;
                    border-radius: 8px;
                    border-left: 4px solid ${colors.primary};
                }

                /* Rich text styling */
                .rich-text-content {
                    line-height: 1.8;
                }

                .rich-text-content p {
                    margin-bottom: 12px;
                }

                .rich-text-content h1,
                .rich-text-content h2,
                .rich-text-content h3,
                .rich-text-content h4,
                .rich-text-content h5,
                .rich-text-content h6 {
                    margin-top: 16px;
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .rich-text-content ul,
                .rich-text-content ol {
                    margin-left: 20px;
                    margin-bottom: 12px;
                }

                .rich-text-content li {
                    margin-bottom: 6px;
                }

                .rich-text-content strong {
                    font-weight: 600;
                }

                .rich-text-content em {
                    font-style: italic;
                }

                .rich-text-content a {
                    color: ${colors.primary};
                    text-decoration: underline;
                }

                .rich-text-content blockquote {
                    border-left: 4px solid ${colors.border};
                    padding-left: 16px;
                    margin: 16px 0;
                    color: #666;
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
                        min-height: 100px;
                        padding: 4px;
                    }

                    .event-item {
                        font-size: ${typography.eventFontSize - 3}px;
                        padding: 2px 4px;
                    }

                    .nav-button, .today-button, .view-button {
                        padding: 6px 12px;
                        font-size: 12px;
                    }

                    .modal-content {
                        width: 95%;
                        max-height: 90vh;
                    }

                    .modal-header {
                        padding: 20px;
                    }

                    .modal-body {
                        padding: 20px;
                    }
                }

                @media (max-width: 480px) {
                    .header-title {
                        font-size: ${typography.headerFontSize}px;
                    }

                    .day-number {
                        font-size: ${typography.eventFontSize}px;
                    }

                    .day-cell {
                        min-height: 80px;
                        padding: 2px;
                    }

                    .modal-title {
                        font-size: ${typography.headerFontSize + 2}px;
                    }
                }
            </style>

            <div class="calendar-container">
                <div class="calendar-header">
                    <h2 class="header-title">${this.getHeaderTitle()}</h2>
                    <div class="header-controls">
                        ${navigation.showNavigationButtons ? `
                            <button class="nav-button" id="prevBtn">◀ Previous</button>
                            ${navigation.showTodayButton ? '<button class="today-button" id="todayBtn">Today</button>' : ''}
                            <button class="nav-button" id="nextBtn">Next ▶</button>
                        ` : ''}
                        <button class="view-button ${this.viewMode === 'month' ? 'active' : ''}" id="monthViewBtn">Month</button>
                        <button class="view-button ${this.viewMode === 'week' ? 'active' : ''}" id="weekViewBtn">Week</button>
                        <button class="view-button ${this.viewMode === 'day' ? 'active' : ''}" id="dayViewBtn">Day</button>
                    </div>
                </div>
                <div class="calendar-body">
                    ${this.renderView()}
                </div>
            </div>

            <!-- Event Modal -->
            <div class="event-modal" id="eventModal">
                <div class="modal-content" id="modalContent">
                    <!-- Content will be populated dynamically -->
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    getHeaderTitle() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        if (this.viewMode === 'month') {
            return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        } else if (this.viewMode === 'week') {
            const weekStart = this.getWeekStart(this.currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            return `Week of ${months[weekStart.getMonth()]} ${weekStart.getDate()} - ${months[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
        } else {
            return `${days[this.currentDate.getDay()]}, ${months[this.currentDate.getMonth()]} ${this.currentDate.getDate()}, ${this.currentDate.getFullYear()}`;
        }
    }

    renderView() {
        if (this.viewMode === 'month') {
            return this.renderMonthView();
        } else if (this.viewMode === 'week') {
            return this.renderWeekView();
        } else {
            return this.renderDayView();
        }
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

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const reorderedDays = [...days.slice(this.options.firstDayOfWeek), ...days.slice(0, this.options.firstDayOfWeek)];

        let html = '<div class="month-view">';

        if (this.options.showWeekNumbers) {
            html += '<div class="week-number">Wk</div>';
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
                const dayEvents = this.getEventsForDate(currentRenderDate);
                const dayHolidays = this.getHolidaysForDate(currentRenderDate);
                const isHoliday = dayHolidays.length > 0;
                const moonPhase = this.options.display.showMoonPhases ? this.getMoonPhase(currentRenderDate) : '';

                html += `
                    <div class="day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''} ${isHoliday ? 'holiday' : ''}" 
                         data-date="${currentRenderDate.toISOString()}">
                        ${isHoliday && this.options.showHolidays ? '<div class="holiday-indicator"></div>' : ''}
                        <div class="day-number">
                            <span>${currentRenderDate.getDate()}</span>
                            ${moonPhase ? `<span class="moon-phase">${moonPhase}</span>` : ''}
                        </div>
                        ${isHoliday && this.options.showHolidays ? 
                            `<div class="holiday-name" title="${dayHolidays[0].name}">${dayHolidays[0].name}</div>` : ''}
                        <div class="event-dot-container">
                            ${dayEvents.slice(0, 3).map(event => 
                                `<div class="event-dot" style="background: ${event.color};" title="${event.title}"></div>`
                            ).join('')}
                            ${dayEvents.length > 3 ? `<span style="font-size: 11px; color: #999; font-weight: 600;">+${dayEvents.length - 3}</span>` : ''}
                        </div>
                        ${dayEvents.slice(0, 2).map(event => 
                            `<div class="event-item" style="background: ${event.color};" data-event-id="${event.id}" title="${event.title}">
                                ${event.title}
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

    renderWeekView() {
        const weekStart = this.getWeekStart(this.currentDate);
        const hours = Array.from({length: 24}, (_, i) => i);
        const days = [];
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            days.push(day);
        }

        let html = '<div class="week-view">';
        
        html += '<div class="time-slot header"></div>';
        days.forEach(day => {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const isToday = this.isSameDay(day, new Date());
            html += `<div class="day-header" style="${isToday ? 'background: ' + this.options.colors.secondary : ''}">${dayNames[day.getDay()]} ${day.getDate()}</div>`;
        });

        hours.forEach(hour => {
            const timeString = hour === 0 ? '12 AM' : 
                              hour < 12 ? `${hour} AM` : 
                              hour === 12 ? '12 PM' : 
                              `${hour - 12} PM`;
            html += `<div class="time-slot" style="font-weight: 600; background: #f8f9fa;">${timeString}</div>`;
            days.forEach(day => {
                const dayEvents = this.getEventsForDate(day);
                const dayHolidays = this.getHolidaysForDate(day);
                html += `
                    <div class="time-slot">
                        ${dayHolidays.length > 0 && this.options.showHolidays && hour === 0 ? 
                            `<div style="background: ${this.options.colors.holiday}; color: white; padding: 4px; border-radius: 4px; font-size: 11px; margin-bottom: 4px;">${dayHolidays[0].name}</div>` : ''}
                        ${dayEvents.map(event => {
                            if (event.isAllDay && hour === 0) {
                                return `<div class="event-item" style="background: ${event.color};" data-event-id="${event.id}" title="${event.title}">
                                    ${event.title}
                                </div>`;
                            } else if (!event.isAllDay && this.isEventInHour(event, hour)) {
                                return `<div class="event-item" style="background: ${event.color};" data-event-id="${event.id}" title="${event.title}">
                                    ${event.title}
                                </div>`;
                            }
                            return '';
                        }).join('')}
                    </div>
                `;
            });
        });

        html += '</div>';
        return html;
    }

    renderDayView() {
        const dayEvents = this.getEventsForDate(this.currentDate);
        const dayHolidays = this.getHolidaysForDate(this.currentDate);
        
        let html = '<div class="day-view">';
        html += `<div class="day-view-header">${this.currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>`;
        
        if (dayEvents.length === 0 && dayHolidays.length === 0) {
            html += `<div class="no-events">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <div>No events scheduled for this day</div>
            </div>`;
        } else {
            html += '<div class="day-view-events">';
            
            if (this.options.showHolidays) {
                dayHolidays.forEach(holiday => {
                    html += `
                        <div class="day-event-card holiday-card">
                            <div class="event-title">🎉 ${holiday.name}</div>
                            <div class="event-category">Public Holiday</div>
                            ${holiday.localName && holiday.localName !== holiday.name ? 
                                `<div class="event-description">Local name: ${holiday.localName}</div>` : ''}
                        </div>
                    `;
                });
            }
            
            dayEvents.forEach(event => {
                html += `
                    <div class="day-event-card" style="border-left-color: ${event.color};" data-event-id="${event.id}">
                        <div class="event-title">${event.title}</div>
                        ${this.options.display.showEventTime && !event.isAllDay ? 
                            `<div class="event-time">⏰ ${event.startTime} - ${event.endTime}</div>` : 
                            event.isAllDay ? '<div class="event-time">🌍 All Day Event</div>' : ''}
                        ${this.options.display.showEventCategory ? 
                            `<div class="event-category">${event.category}</div>` : ''}
                        ${event.description ? 
                            `<div class="event-description rich-text-content">${event.description}</div>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }

    attachEventListeners() {
        const prevBtn = this.shadowRoot.getElementById('prevBtn');
        const nextBtn = this.shadowRoot.getElementById('nextBtn');
        const todayBtn = this.shadowRoot.getElementById('todayBtn');
        const monthViewBtn = this.shadowRoot.getElementById('monthViewBtn');
        const weekViewBtn = this.shadowRoot.getElementById('weekViewBtn');
        const dayViewBtn = this.shadowRoot.getElementById('dayViewBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.navigate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigate(1));
        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());
        if (monthViewBtn) monthViewBtn.addEventListener('click', () => this.changeView('month'));
        if (weekViewBtn) weekViewBtn.addEventListener('click', () => this.changeView('week'));
        if (dayViewBtn) dayViewBtn.addEventListener('click', () => this.changeView('day'));

        // Day cell clicks
        this.shadowRoot.querySelectorAll('.day-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const date = new Date(cell.dataset.date);
                this.currentDate = new Date(date);
                this.changeView('day');
            });
        });

        // Event item clicks
        this.shadowRoot.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = item.dataset.eventId;
                const event = this.events.find(e => e.id === eventId);
                if (event) {
                    this.showEventModal(event);
                }
            });
        });

        // Day view event cards
        this.shadowRoot.querySelectorAll('.day-event-card').forEach(card => {
            if (card.dataset.eventId) {
                card.addEventListener('click', () => {
                    const eventId = card.dataset.eventId;
                    const event = this.events.find(e => e.id === eventId);
                    if (event) {
                        this.showEventModal(event);
                    }
                });
            }
        });

        // Modal close
        const modal = this.shadowRoot.getElementById('eventModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeEventModal();
                }
            });
        }
    }

    showEventModal(event) {
        const modal = this.shadowRoot.getElementById('eventModal');
        const modalContent = this.shadowRoot.getElementById('modalContent');
        
        const timeInfo = event.isAllDay ? 
            '🌍 All Day Event' : 
            `⏰ ${event.startTime} - ${event.endTime}`;
        
        modalContent.innerHTML = `
            <div class="modal-header" style="background: linear-gradient(135deg, ${event.color}, ${this.adjustColor(event.color, -20)});">
                <button class="modal-close" id="modalCloseBtn">&times;</button>
                <h2 class="modal-title">${event.title}</h2>
            </div>
            <div class="modal-body">
                ${this.options.display.showEventCategory ? `
                <div class="modal-section">
                    <div class="modal-category-badge">${event.category}</div>
                </div>
                ` : ''}
                
                ${this.options.display.showEventTime ? `
                <div class="modal-section">
                    <div class="modal-time-info">
                        <div class="modal-section-title">
                            ${timeInfo}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                ${event.description ? `
                <div class="modal-section">
                    <div class="modal-section-title">
                        📝 Description
                    </div>
                    <div class="modal-section-content rich-text-content">
                        ${event.description}
                    </div>
                </div>
                ` : ''}
                
                <div class="modal-section">
                    <div class="modal-section-title">
                        📅 Date
                    </div>
                    <div class="modal-section-content">
                        ${new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>
            </div>
        `;
        
        // Attach close button listener
        const closeBtn = modalContent.querySelector('#modalCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeEventModal());
        }
        
        modal.classList.add('show');
    }

    closeEventModal() {
        const modal = this.shadowRoot.getElementById('eventModal');
        modal.classList.remove('show');
    }

    // Helper to adjust color brightness
    adjustColor(color, amount) {
        const clamp = (num) => Math.min(Math.max(num, 0), 255);
        const num = parseInt(color.replace('#', ''), 16);
        const r = clamp((num >> 16) + amount);
        const g = clamp(((num >> 8) & 0x00FF) + amount);
        const b = clamp((num & 0x0000FF) + amount);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    navigate(direction) {
        const newDate = new Date(this.currentDate);
        
        if (this.viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + direction);
        } else if (this.viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        } else {
            newDate.setDate(newDate.getDate() + direction);
        }
        
        this.currentDate = newDate;
        this.render();
    }

    goToToday() {
        this.currentDate = new Date();
        this.render();
    }

    changeView(mode) {
        this.viewMode = mode;
        this.options.viewMode = mode;
        this.render();
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return this.isSameDay(eventDate, date);
        });
    }

    getHolidaysForDate(date) {
        if (!this.options.showHolidays) return [];
        
        return this.holidays.filter(holiday => {
            const holidayDate = new Date(holiday.date);
            return this.isSameDay(holidayDate, date);
        });
    }

    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = (day < this.options.firstDayOfWeek ? 7 : 0) + day - this.options.firstDayOfWeek;
        d.setDate(d.getDate() - diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    isEventInHour(event, hour) {
        if (event.isAllDay) return false;
        
        const timeStr = event.startTime.toUpperCase();
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        
        let startHour = hours;
        if (period === 'PM' && hours !== 12) startHour += 12;
        if (period === 'AM' && hours === 12) startHour = 0;
        
        return startHour === hour;
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

customElements.define('advanced-calendar', AdvancedCalendar);
