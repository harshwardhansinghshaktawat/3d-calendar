class AdvancedCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.events = [];
        this.currentDate = new Date();
        this.selectedDate = null;
        this.viewMode = 'month';
        this.options = {
            viewMode: 'month',
            firstDayOfWeek: 0,
            showWeekNumbers: true,
            colors: {
                primary: '#3498db',
                secondary: '#2ecc71',
                background: '#ffffff',
                text: '#2c3e50',
                border: '#ecf0f1',
                hover: '#e8f4f8'
            },
            typography: {
                fontFamily: 'Arial, sans-serif',
                headerFontSize: 16,
                eventFontSize: 14
            },
            layout: {
                height: 600,
                cellPadding: 8,
                borderRadius: 8
            },
            display: {
                showEventTime: true,
                showEventCategory: true,
                enableHover: true
            },
            navigation: {
                showNavigationButtons: true,
                showTodayButton: true
            }
        };
    }

    static get observedAttributes() {
        return ['events-data', 'calendar-options'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'events-data' && newValue) {
            try {
                this.events = JSON.parse(newValue);
                this.render();
            } catch (e) {
                console.error('Error parsing events data:', e);
            }
        } else if (name === 'calendar-options' && newValue) {
            try {
                const newOptions = JSON.parse(newValue);
                this.options = { ...this.options, ...newOptions };
                this.viewMode = this.options.viewMode;
                this.render();
            } catch (e) {
                console.error('Error parsing calendar options:', e);
            }
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const { colors, typography, layout, navigation } = this.options;
        
        this.shadowRoot.innerHTML = `
            <style>
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
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    height: ${layout.height}px;
                    display: flex;
                    flex-direction: column;
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
                }

                .header-title {
                    font-size: ${typography.headerFontSize + 4}px;
                    font-weight: bold;
                    margin: 0;
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
                }

                .nav-button:hover, .today-button:hover, .view-button:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }

                .nav-button:active, .today-button:active, .view-button:active {
                    transform: translateY(0);
                }

                .view-button.active {
                    background: rgba(255, 255, 255, 0.4);
                    font-weight: bold;
                }

                .calendar-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }

                /* Month View Styles */
                .month-view {
                    display: grid;
                    grid-template-columns: ${this.options.showWeekNumbers ? 'auto ' : ''}repeat(7, 1fr);
                    gap: 1px;
                    background: ${colors.border};
                    border: 1px solid ${colors.border};
                }

                .day-header, .week-number {
                    background: ${colors.primary};
                    color: white;
                    padding: 12px;
                    text-align: center;
                    font-weight: bold;
                    font-size: ${typography.eventFontSize}px;
                }

                .week-number {
                    background: ${colors.secondary};
                }

                .day-cell {
                    background: white;
                    min-height: 100px;
                    padding: ${layout.cellPadding}px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .day-cell:hover {
                    background: ${this.options.display.enableHover ? colors.hover : 'white'};
                    transform: ${this.options.display.enableHover ? 'scale(1.02)' : 'none'};
                    z-index: 10;
                }

                .day-cell.other-month {
                    opacity: 0.3;
                }

                .day-cell.today {
                    border: 2px solid ${colors.primary};
                    background: ${colors.hover};
                }

                .day-cell.selected {
                    background: ${colors.primary};
                    color: white;
                }

                .day-number {
                    font-weight: bold;
                    font-size: ${typography.eventFontSize + 2}px;
                    margin-bottom: 8px;
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
                }

                .event-item:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                /* Week View Styles */
                .week-view {
                    display: grid;
                    grid-template-columns: 60px repeat(7, 1fr);
                    gap: 1px;
                    background: ${colors.border};
                }

                .time-slot {
                    background: white;
                    border: 1px solid ${colors.border};
                    padding: 8px;
                    font-size: ${typography.eventFontSize - 2}px;
                    text-align: center;
                }

                /* Day View Styles */
                .day-view {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .day-view-header {
                    background: ${colors.primary};
                    color: white;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: ${typography.headerFontSize}px;
                    font-weight: bold;
                }

                .day-view-events {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .day-event-card {
                    background: white;
                    border-left: 4px solid ${colors.primary};
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .day-event-card:hover {
                    transform: translateX(8px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                .event-title {
                    font-size: ${typography.eventFontSize + 2}px;
                    font-weight: bold;
                    margin-bottom: 8px;
                    color: ${colors.text};
                }

                .event-time {
                    font-size: ${typography.eventFontSize}px;
                    color: ${colors.primary};
                    margin-bottom: 4px;
                }

                .event-category {
                    display: inline-block;
                    background: ${colors.secondary};
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: ${typography.eventFontSize - 2}px;
                    margin-bottom: 8px;
                }

                .event-description {
                    font-size: ${typography.eventFontSize}px;
                    color: #666;
                    line-height: 1.5;
                }

                .no-events {
                    text-align: center;
                    padding: 40px;
                    color: #999;
                    font-size: ${typography.eventFontSize + 2}px;
                }

                /* Tooltip */
                .event-tooltip {
                    position: absolute;
                    background: white;
                    border: 1px solid ${colors.border};
                    border-radius: 8px;
                    padding: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    min-width: 200px;
                    display: none;
                }

                .event-tooltip.show {
                    display: block;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .calendar-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .header-controls {
                        justify-content: center;
                    }

                    .month-view {
                        grid-template-columns: repeat(7, 1fr);
                    }

                    .day-cell {
                        min-height: 80px;
                        padding: 4px;
                    }

                    .event-item {
                        font-size: ${typography.eventFontSize - 3}px;
                        padding: 2px 4px;
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
        `;

        this.attachEventListeners();
    }

    getHeaderTitle() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        if (this.viewMode === 'month') {
            return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        } else if (this.viewMode === 'week') {
            const weekStart = this.getWeekStart(this.currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            return `${months[weekStart.getMonth()]} ${weekStart.getDate()} - ${months[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
        } else {
            return `${months[this.currentDate.getMonth()]} ${this.currentDate.getDate()}, ${this.currentDate.getFullYear()}`;
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
        startDate.setDate(startDate.getDate() - ((firstDay.getDay() - this.options.firstDayOfWeek + 7) % 7));

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const reorderedDays = [...days.slice(this.options.firstDayOfWeek), ...days.slice(0, this.options.firstDayOfWeek)];

        let html = '<div class="month-view">';

        // Week number header
        if (this.options.showWeekNumbers) {
            html += '<div class="week-number">Wk</div>';
        }

        // Day headers
        reorderedDays.forEach(day => {
            html += `<div class="day-header">${day}</div>`;
        });

        // Calendar days
        let currentRenderDate = new Date(startDate);
        let weekNumber = this.getWeekNumber(currentRenderDate);

        while (currentRenderDate <= lastDay || currentRenderDate.getMonth() === month) {
            // Week number
            if (this.options.showWeekNumbers && currentRenderDate.getDay() === this.options.firstDayOfWeek) {
                html += `<div class="week-number">${weekNumber}</div>`;
                weekNumber++;
            }

            const isToday = this.isSameDay(currentRenderDate, new Date());
            const isOtherMonth = currentRenderDate.getMonth() !== month;
            const dayEvents = this.getEventsForDate(currentRenderDate);

            html += `
                <div class="day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}" 
                     data-date="${currentRenderDate.toISOString()}">
                    <div class="day-number">${currentRenderDate.getDate()}</div>
                    <div class="event-dot-container">
                        ${dayEvents.slice(0, 3).map(event => 
                            `<div class="event-dot" style="background: ${event.color};" title="${event.title}"></div>`
                        ).join('')}
                        ${dayEvents.length > 3 ? `<span style="font-size: 12px; color: #999;">+${dayEvents.length - 3}</span>` : ''}
                    </div>
                    ${dayEvents.slice(0, 2).map(event => 
                        `<div class="event-item" style="background: ${event.color};" data-event-id="${event.id}">
                            ${event.title}
                        </div>`
                    ).join('')}
                </div>
            `;

            currentRenderDate.setDate(currentRenderDate.getDate() + 1);
            
            // Break if we've gone too far
            if (currentRenderDate.getMonth() > month + 1) break;
            if (currentRenderDate.getMonth() === month + 1 && currentRenderDate.getDate() > 7) break;
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
        
        // Header row
        html += '<div class="time-slot"></div>';
        days.forEach(day => {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            html += `<div class="day-header">${dayNames[day.getDay()]} ${day.getDate()}</div>`;
        });

        // Time slots
        hours.forEach(hour => {
            html += `<div class="time-slot">${hour}:00</div>`;
            days.forEach(day => {
                const dayEvents = this.getEventsForDate(day);
                html += `
                    <div class="time-slot">
                        ${dayEvents.map(event => {
                            if (event.isAllDay || this.isEventInHour(event, hour)) {
                                return `<div class="event-item" style="background: ${event.color};" data-event-id="${event.id}">
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
        
        let html = '<div class="day-view">';
        html += `<div class="day-view-header">${this.currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>`;
        
        if (dayEvents.length === 0) {
            html += '<div class="no-events">No events scheduled for this day</div>';
        } else {
            html += '<div class="day-view-events">';
            dayEvents.forEach(event => {
                html += `
                    <div class="day-event-card" style="border-left-color: ${event.color};">
                        <div class="event-title">${event.title}</div>
                        ${this.options.display.showEventTime && !event.isAllDay ? 
                            `<div class="event-time">⏰ ${event.startTime} - ${event.endTime}</div>` : 
                            event.isAllDay ? '<div class="event-time">All Day</div>' : ''}
                        ${this.options.display.showEventCategory ? 
                            `<div class="event-category">${event.category}</div>` : ''}
                        ${event.description ? 
                            `<div class="event-description">${event.description}</div>` : ''}
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
                this.currentDate = date;
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
                    this.showEventDetails(event);
                }
            });
        });
    }

    navigate(direction) {
        if (this.viewMode === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        } else if (this.viewMode === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        } else {
            this.currentDate.setDate(this.currentDate.getDate() + direction);
        }
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

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
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
        const startHour = parseInt(event.startTime.split(':')[0]);
        return startHour === hour;
    }

    showEventDetails(event) {
        alert(`Event: ${event.title}\n\nCategory: ${event.category}\n\n${event.isAllDay ? 'All Day Event' : `Time: ${event.startTime} - ${event.endTime}`}\n\n${event.description || 'No description'}`);
    }
}

customElements.define('advanced-calendar', AdvancedCalendar);
