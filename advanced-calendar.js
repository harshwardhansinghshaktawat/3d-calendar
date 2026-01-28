class AdvancedCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.events = [];
        this.holidays = [];
        this.currentDate = new Date();
        this.selectedDate = null;
        this.viewMode = 'month';
        this.language = 'en';
        this.options = {
            viewMode: 'month',
            firstDayOfWeek: 0,
            showWeekNumbers: true,
            showHolidays: true,
            countryCode: 'US',
            language: 'en',
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
        
        // Localization data
        this.translations = {
            en: {
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                today: 'Today',
                week: 'Wk',
                allDay: 'All Day Event',
                noEvents: 'No events scheduled for this day',
                description: 'Description',
                category: 'Category',
                date: 'Date',
                publicHoliday: 'Public Holiday',
                weekOf: 'Week of',
                previous: 'Previous',
                next: 'Next',
                month: 'Month',
                day: 'Day',
                addToCalendar: 'Add to Calendar',
                googleCalendar: 'Google Calendar',
                appleCalendar: 'Apple Calendar',
                outlookCalendar: 'Outlook Calendar',
                yahooCalendar: 'Yahoo Calendar',
                downloadICS: 'Download ICS File'
            },
            de: {
                months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                daysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                today: 'Heute',
                week: 'Woche',
                allDay: 'Ganztägig',
                noEvents: 'Keine Veranstaltungen für diesen Tag geplant',
                description: 'Beschreibung',
                category: 'Kategorie',
                date: 'Datum',
                publicHoliday: 'Feiertag',
                weekOf: 'Woche vom',
                previous: 'Zurück',
                next: 'Weiter',
                month: 'Monat',
                day: 'Tag',
                addToCalendar: 'Zum Kalender hinzufügen',
                googleCalendar: 'Google Kalender',
                appleCalendar: 'Apple Kalender',
                outlookCalendar: 'Outlook Kalender',
                yahooCalendar: 'Yahoo Kalender',
                downloadICS: 'ICS Datei herunterladen'
            },
            fr: {
                months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                daysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                today: 'Aujourd\'hui',
                week: 'Sem',
                allDay: 'Toute la journée',
                noEvents: 'Aucun événement prévu pour ce jour',
                description: 'Description',
                category: 'Catégorie',
                date: 'Date',
                publicHoliday: 'Jour férié',
                weekOf: 'Semaine du',
                previous: 'Précédent',
                next: 'Suivant',
                month: 'Mois',
                day: 'Jour',
                addToCalendar: 'Ajouter au calendrier',
                googleCalendar: 'Google Agenda',
                appleCalendar: 'Calendrier Apple',
                outlookCalendar: 'Calendrier Outlook',
                yahooCalendar: 'Calendrier Yahoo',
                downloadICS: 'Télécharger fichier ICS'
            },
            es: {
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                today: 'Hoy',
                week: 'Sem',
                allDay: 'Todo el día',
                noEvents: 'No hay eventos programados para este día',
                description: 'Descripción',
                category: 'Categoría',
                date: 'Fecha',
                publicHoliday: 'Día festivo',
                weekOf: 'Semana del',
                previous: 'Anterior',
                next: 'Siguiente',
                month: 'Mes',
                day: 'Día',
                addToCalendar: 'Añadir al calendario',
                googleCalendar: 'Google Calendar',
                appleCalendar: 'Calendario de Apple',
                outlookCalendar: 'Calendario de Outlook',
                yahooCalendar: 'Calendario de Yahoo',
                downloadICS: 'Descargar archivo ICS'
            },
            pt: {
                months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
                daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                today: 'Hoje',
                week: 'Sem',
                allDay: 'Dia inteiro',
                noEvents: 'Nenhum evento agendado para este dia',
                description: 'Descrição',
                category: 'Categoria',
                date: 'Data',
                publicHoliday: 'Feriado',
                weekOf: 'Semana de',
                previous: 'Anterior',
                next: 'Próximo',
                month: 'Mês',
                day: 'Dia',
                addToCalendar: 'Adicionar ao calendário',
                googleCalendar: 'Google Agenda',
                appleCalendar: 'Calendário Apple',
                outlookCalendar: 'Calendário Outlook',
                yahooCalendar: 'Calendário Yahoo',
                downloadICS: 'Baixar arquivo ICS'
            },
            it: {
                months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                days: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
                daysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
                today: 'Oggi',
                week: 'Sett',
                allDay: 'Tutto il giorno',
                noEvents: 'Nessun evento programmato per questo giorno',
                description: 'Descrizione',
                category: 'Categoria',
                date: 'Data',
                publicHoliday: 'Festività',
                weekOf: 'Settimana del',
                previous: 'Precedente',
                next: 'Successivo',
                month: 'Mese',
                day: 'Giorno',
                addToCalendar: 'Aggiungi al calendario',
                googleCalendar: 'Google Calendar',
                appleCalendar: 'Calendario Apple',
                outlookCalendar: 'Calendario Outlook',
                yahooCalendar: 'Calendario Yahoo',
                downloadICS: 'Scarica file ICS'
            },
            ru: {
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                today: 'Сегодня',
                week: 'Нед',
                allDay: 'Весь день',
                noEvents: 'На этот день нет запланированных событий',
                description: 'Описание',
                category: 'Категория',
                date: 'Дата',
                publicHoliday: 'Государственный праздник',
                weekOf: 'Неделя',
                previous: 'Назад',
                next: 'Вперед',
                month: 'Месяц',
                day: 'День',
                addToCalendar: 'Добавить в календарь',
                googleCalendar: 'Google Календарь',
                appleCalendar: 'Календарь Apple',
                outlookCalendar: 'Календарь Outlook',
                yahooCalendar: 'Календарь Yahoo',
                downloadICS: 'Скачать ICS файл'
            },
            ja: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                days: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
                daysShort: ['日', '月', '火', '水', '木', '金', '土'],
                today: '今日',
                week: '週',
                allDay: '終日',
                noEvents: 'この日の予定はありません',
                description: '説明',
                category: 'カテゴリー',
                date: '日付',
                publicHoliday: '祝日',
                weekOf: '週',
                previous: '前',
                next: '次',
                month: '月',
                day: '日',
                addToCalendar: 'カレンダーに追加',
                googleCalendar: 'Googleカレンダー',
                appleCalendar: 'Appleカレンダー',
                outlookCalendar: 'Outlookカレンダー',
                yahooCalendar: 'Yahooカレンダー',
                downloadICS: 'ICSファイルをダウンロード'
            },
            zh: {
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                daysShort: ['日', '一', '二', '三', '四', '五', '六'],
                today: '今天',
                week: '周',
                allDay: '全天',
                noEvents: '今天没有安排活动',
                description: '描述',
                category: '类别',
                date: '日期',
                publicHoliday: '公共假期',
                weekOf: '周',
                previous: '上一个',
                next: '下一个',
                month: '月',
                day: '日',
                addToCalendar: '添加到日历',
                googleCalendar: '谷歌日历',
                appleCalendar: '苹果日历',
                outlookCalendar: 'Outlook日历',
                yahooCalendar: '雅虎日历',
                downloadICS: '下载ICS文件'
            },
            ko: {
                months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                days: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
                daysShort: ['일', '월', '화', '수', '목', '금', '토'],
                today: '오늘',
                week: '주',
                allDay: '종일',
                noEvents: '이 날짜에 예정된 이벤트가 없습니다',
                description: '설명',
                category: '카테고리',
                date: '날짜',
                publicHoliday: '공휴일',
                weekOf: '주',
                previous: '이전',
                next: '다음',
                month: '월',
                day: '일',
                addToCalendar: '캘린더에 추가',
                googleCalendar: '구글 캘린더',
                appleCalendar: '애플 캘린더',
                outlookCalendar: '아웃룩 캘린더',
                yahooCalendar: '야후 캘린더',
                downloadICS: 'ICS 파일 다운로드'
            },
            ar: {
                months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                monthsShort: ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'],
                days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                daysShort: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
                today: 'اليوم',
                week: 'أسبوع',
                allDay: 'طوال اليوم',
                noEvents: 'لا توجد أحداث مجدولة لهذا اليوم',
                description: 'وصف',
                category: 'فئة',
                date: 'تاريخ',
                publicHoliday: 'عطلة رسمية',
                weekOf: 'أسبوع',
                previous: 'السابق',
                next: 'التالي',
                month: 'شهر',
                day: 'يوم',
                addToCalendar: 'إضافة إلى التقويم',
                googleCalendar: 'تقويم جوجل',
                appleCalendar: 'تقويم أبل',
                outlookCalendar: 'تقويم Outlook',
                yahooCalendar: 'تقويم ياهو',
                downloadICS: 'تحميل ملف ICS'
            },
            vi: {
                months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                monthsShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
                days: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
                daysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                today: 'Hôm nay',
                week: 'Tuần',
                allDay: 'Cả ngày',
                noEvents: 'Không có sự kiện nào được lên lịch cho ngày này',
                description: 'Mô tả',
                category: 'Danh mục',
                date: 'Ngày',
                publicHoliday: 'Ngày lễ',
                weekOf: 'Tuần',
                previous: 'Trước',
                next: 'Tiếp theo',
                month: 'Tháng',
                day: 'Ngày',
                addToCalendar: 'Thêm vào lịch',
                googleCalendar: 'Google Calendar',
                appleCalendar: 'Apple Calendar',
                outlookCalendar: 'Outlook Calendar',
                yahooCalendar: 'Yahoo Calendar',
                downloadICS: 'Tải xuống tệp ICS'
            },
            id: {
                months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
                monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
                days: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
                daysShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                today: 'Hari ini',
                week: 'Minggu',
                allDay: 'Sepanjang hari',
                noEvents: 'Tidak ada acara yang dijadwalkan untuk hari ini',
                description: 'Deskripsi',
                category: 'Kategori',
                date: 'Tanggal',
                publicHoliday: 'Hari libur',
                weekOf: 'Minggu',
                previous: 'Sebelumnya',
                next: 'Berikutnya',
                month: 'Bulan',
                day: 'Hari',
                addToCalendar: 'Tambahkan ke Kalender',
                googleCalendar: 'Google Calendar',
                appleCalendar: 'Apple Calendar',
                outlookCalendar: 'Outlook Calendar',
                yahooCalendar: 'Yahoo Calendar',
                downloadICS: 'Unduh file ICS'
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
                console.log('✅ Events loaded:', this.events.length);
                this.render();
            } catch (e) {
                console.error('Error parsing events data:', e);
            }
        } else if (name === 'holidays-data' && newValue) {
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
                this.viewMode = this.options.viewMode;
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

    // Generate ICS file content
    generateICS(event) {
        const eventDate = new Date(event.date);
        const startDateTime = this.parseEventDateTime(event, eventDate, event.startTime);
        const endDateTime = this.parseEventDateTime(event, eventDate, event.endTime);
        
        const formatICSDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const escapeICS = (str) => {
            return str.replace(/\\/g, '\\\\')
                      .replace(/;/g, '\\;')
                      .replace(/,/g, '\\,')
                      .replace(/\n/g, '\\n');
        };
        
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Advanced Calendar//EN',
            'BEGIN:VEVENT',
            `UID:${event.id}@advanced-calendar`,
            `DTSTAMP:${formatICSDate(new Date())}`,
            `DTSTART:${formatICSDate(startDateTime)}`,
            `DTEND:${formatICSDate(endDateTime)}`,
            `SUMMARY:${escapeICS(event.title)}`,
            event.description ? `DESCRIPTION:${escapeICS(event.description.replace(/<[^>]*>/g, ''))}` : '',
            event.category ? `CATEGORIES:${escapeICS(event.category)}` : '',
            event.linkUrl ? `URL:${event.linkUrl}` : '',
            'END:VEVENT',
            'END:VCALENDAR'
        ].filter(line => line).join('\r\n');
        
        return icsContent;
    }
    
    parseEventDateTime(event, eventDate, timeString) {
        if (event.isAllDay) {
            const date = new Date(eventDate);
            date.setHours(0, 0, 0, 0);
            return date;
        }
        
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        
        let hour = hours;
        if (period === 'PM' && hours !== 12) hour += 12;
        if (period === 'AM' && hours === 12) hour = 0;
        
        const date = new Date(eventDate);
        date.setHours(hour, minutes, 0, 0);
        return date;
    }
    
    // Add to Google Calendar
    addToGoogleCalendar(event) {
        const eventDate = new Date(event.date);
        const startDateTime = this.parseEventDateTime(event, eventDate, event.startTime);
        const endDateTime = this.parseEventDateTime(event, eventDate, event.endTime);
        
        const formatGoogleDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title,
            dates: `${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}`,
            details: event.description ? event.description.replace(/<[^>]*>/g, '') : '',
            location: event.linkUrl || ''
        });
        
        window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    }
    
    // Add to Outlook Calendar
    addToOutlookCalendar(event) {
        const eventDate = new Date(event.date);
        const startDateTime = this.parseEventDateTime(event, eventDate, event.startTime);
        const endDateTime = this.parseEventDateTime(event, eventDate, event.endTime);
        
        const params = new URLSearchParams({
            path: '/calendar/action/compose',
            rru: 'addevent',
            subject: event.title,
            startdt: startDateTime.toISOString(),
            enddt: endDateTime.toISOString(),
            body: event.description ? event.description.replace(/<[^>]*>/g, '') : '',
            location: event.linkUrl || ''
        });
        
        window.open(`https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`, '_blank');
    }
    
    // Add to Yahoo Calendar
    addToYahooCalendar(event) {
        const eventDate = new Date(event.date);
        const startDateTime = this.parseEventDateTime(event, eventDate, event.startTime);
        const endDateTime = this.parseEventDateTime(event, eventDate, event.endTime);
        
        const formatYahooDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const params = new URLSearchParams({
            v: '60',
            title: event.title,
            st: formatYahooDate(startDateTime),
            et: formatYahooDate(endDateTime),
            desc: event.description ? event.description.replace(/<[^>]*>/g, '') : '',
            in_loc: event.linkUrl || ''
        });
        
        window.open(`https://calendar.yahoo.com/?${params.toString()}`, '_blank');
    }
    
    // Download ICS file
    downloadICS(event) {
        const icsContent = this.generateICS(event);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
        link.click();
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
                    overflow: visible;
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
                    white-space: normal;
                    word-wrap: break-word;
                    line-height: 1.3;
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
                    white-space: normal;
                    word-wrap: break-word;
                    line-height: 1.3;
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

                /* Add to Calendar Buttons */
                .add-to-calendar-section {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 2px solid ${colors.border};
                }

                .add-calendar-title {
                    font-size: ${typography.eventFontSize + 2}px;
                    font-weight: 600;
                    color: ${colors.text};
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .calendar-buttons-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }

                .calendar-btn {
                    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                    color: white;
                    border: none;
                    padding: 12px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: ${typography.eventFontSize}px;
                    font-weight: 500;
                    font-family: ${typography.fontFamily};
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                .calendar-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                }

                .calendar-btn:active {
                    transform: translateY(0);
                }

                .calendar-btn svg {
                    width: 18px;
                    height: 18px;
                    fill: white;
                }

                /* Custom Link Button */
                .custom-link-button {
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    padding: 14px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: ${typography.eventFontSize + 2}px;
                    font-weight: 600;
                    font-family: ${typography.fontFamily};
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
                    text-decoration: none;
                    margin-top: 15px;
                    width: 100%;
                }

                .custom-link-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
                }

                .custom-link-button:active {
                    transform: translateY(0);
                }

                .custom-link-button svg {
                    width: 20px;
                    height: 20px;
                    fill: white;
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

                    .calendar-buttons-grid {
                        grid-template-columns: 1fr;
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
                            <button class="nav-button" id="prevBtn">◀ ${this.t('previous')}</button>
                            ${navigation.showTodayButton ? `<button class="today-button" id="todayBtn">${this.t('today')}</button>` : ''}
                            <button class="nav-button" id="nextBtn">${this.t('next')} ▶</button>
                        ` : ''}
                        <button class="view-button ${this.viewMode === 'month' ? 'active' : ''}" id="monthViewBtn">${this.t('month')}</button>
                        <button class="view-button ${this.viewMode === 'week' ? 'active' : ''}" id="weekViewBtn">${this.t('week')}</button>
                        <button class="view-button ${this.viewMode === 'day' ? 'active' : ''}" id="dayViewBtn">${this.t('day')}</button>
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
        const months = this.t('months');
        const days = this.t('days');
        
        if (this.viewMode === 'month') {
            return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        } else if (this.viewMode === 'week') {
            const weekStart = this.getWeekStart(this.currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            return `${this.t('weekOf')} ${months[weekStart.getMonth()]} ${weekStart.getDate()} - ${months[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
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

        const daysShort = this.t('daysShort');
        const reorderedDaysShort = [...daysShort.slice(this.options.firstDayOfWeek), ...daysShort.slice(0, this.options.firstDayOfWeek)];

        let html = '<div class="week-view">';
        
        html += '<div class="time-slot header"></div>';
        days.forEach((day, index) => {
            const isToday = this.isSameDay(day, new Date());
            html += `<div class="day-header" style="${isToday ? 'background: ' + this.options.colors.secondary : ''}">${reorderedDaysShort[index]} ${day.getDate()}</div>`;
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
        
        const months = this.t('months');
        const days = this.t('days');
        
        let html = '<div class="day-view">';
        html += `<div class="day-view-header">${days[this.currentDate.getDay()]}, ${months[this.currentDate.getMonth()]} ${this.currentDate.getDate()}, ${this.currentDate.getFullYear()}</div>`;
        
        if (dayEvents.length === 0 && dayHolidays.length === 0) {
            html += `<div class="no-events">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <div>${this.t('noEvents')}</div>
            </div>`;
        } else {
            html += '<div class="day-view-events">';
            
            if (this.options.showHolidays) {
                dayHolidays.forEach(holiday => {
                    html += `
                        <div class="day-event-card holiday-card">
                            <div class="event-title">🎉 ${holiday.name}</div>
                            <div class="event-category">${this.t('publicHoliday')}</div>
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
                            event.isAllDay ? `<div class="event-time">🌍 ${this.t('allDay')}</div>` : ''}
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
            `🌍 ${this.t('allDay')}` : 
            `⏰ ${event.startTime} - ${event.endTime}`;
        
        const months = this.t('months');
        const days = this.t('days');
        const eventDate = new Date(event.date);
        
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
                        📝 ${this.t('description')}
                    </div>
                    <div class="modal-section-content rich-text-content">
                        ${event.description}
                    </div>
                </div>
                ` : ''}
                
                <div class="modal-section">
                    <div class="modal-section-title">
                        📅 ${this.t('date')}
                    </div>
                    <div class="modal-section-content">
                        ${days[eventDate.getDay()]}, ${months[eventDate.getMonth()]} ${eventDate.getDate()}, ${eventDate.getFullYear()}
                    </div>
                </div>

                ${event.linkUrl ? `
                <div class="modal-section">
                    <a href="${event.linkUrl}" target="_blank" rel="noopener noreferrer" class="custom-link-button">
                        <svg viewBox="0 0 24 24">
                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                        </svg>
                        ${event.linkText || 'Learn More'}
                    </a>
                </div>
                ` : ''}

                <div class="add-to-calendar-section">
                    <div class="add-calendar-title">
                        📆 ${this.t('addToCalendar')}
                    </div>
                    <div class="calendar-buttons-grid">
                        <button class="calendar-btn" id="addToGoogle">
                            <svg viewBox="0 0 24 24">
                                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                            </svg>
                            ${this.t('googleCalendar')}
                        </button>
                        <button class="calendar-btn" id="addToOutlook">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            ${this.t('outlookCalendar')}
                        </button>
                        <button class="calendar-btn" id="addToYahoo">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"/>
                            </svg>
                            ${this.t('yahooCalendar')}
                        </button>
                        <button class="calendar-btn" id="downloadICS">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
                            </svg>
                            ${this.t('downloadICS')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Attach event listeners
        const closeBtn = modalContent.querySelector('#modalCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeEventModal());
        }
        
        // Add to calendar buttons
        const addToGoogle = modalContent.querySelector('#addToGoogle');
        if (addToGoogle) {
            addToGoogle.addEventListener('click', () => this.addToGoogleCalendar(event));
        }
        
        const addToOutlook = modalContent.querySelector('#addToOutlook');
        if (addToOutlook) {
            addToOutlook.addEventListener('click', () => this.addToOutlookCalendar(event));
        }
        
        const addToYahoo = modalContent.querySelector('#addToYahoo');
        if (addToYahoo) {
            addToYahoo.addEventListener('click', () => this.addToYahooCalendar(event));
        }
        
        const downloadICS = modalContent.querySelector('#downloadICS');
        if (downloadICS) {
            downloadICS.addEventListener('click', () => this.downloadICS(event));
        }
        
        modal.classList.add('show');
    }

    closeEventModal() {
        const modal = this.shadowRoot.getElementById('eventModal');
        modal.classList.remove('show');
    }

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
        if (!this.options.showHolidays) {
            return [];
        }
        
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
