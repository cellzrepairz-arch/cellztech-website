export type LanguageKey = 'en' | 'pl' | 'es' | 'uk';
export type BookingField = 'device' | 'series' | 'model' | 'issue' | 'name' | 'phone' | 'email' | 'requestedDate' | 'requestedTime' | 'notes';

export const repairIssues = ['Cracked screen', 'Battery replacement', 'Charging port issue', 'Back glass', 'Camera issue', 'Speaker or microphone', 'Device will not turn on', 'Water damage', 'Data recovery', 'Software issue', 'Other / not sure'];

export const issueTranslations: Record<string, Record<LanguageKey, string>> = {
  'Cracked screen': { en: 'Cracked screen', pl: 'Pęknięty ekran', es: 'Pantalla rota', uk: 'Розбитий екран' },
  'Battery replacement': { en: 'Battery replacement', pl: 'Wymiana baterii', es: 'Cambio de batería', uk: 'Заміна батареї' },
  'Charging port issue': { en: 'Charging port issue', pl: 'Problem z portem ładowania', es: 'Problema con el puerto de carga', uk: 'Проблема з портом заряджання' },
  'Back glass': { en: 'Back glass', pl: 'Tylna szybka', es: 'Cristal trasero', uk: 'Заднє скло' },
  'Camera issue': { en: 'Camera issue', pl: 'Problem z aparatem', es: 'Problema con la cámara', uk: 'Проблема з камерою' },
  'Speaker or microphone': { en: 'Speaker or microphone', pl: 'Głośnik lub mikrofon', es: 'Altavoz o micrófono', uk: 'Динамік або мікрофон' },
  'Device will not turn on': { en: 'Device will not turn on', pl: 'Urządzenie się nie włącza', es: 'El dispositivo no enciende', uk: 'Пристрій не вмикається' },
  'Water damage': { en: 'Water damage', pl: 'Zalanie', es: 'Daño por agua', uk: 'Пошкодження водою' },
  'Data recovery': { en: 'Data recovery', pl: 'Odzyskiwanie danych', es: 'Recuperación de datos', uk: 'Відновлення даних' },
  'Software issue': { en: 'Software issue', pl: 'Problem z oprogramowaniem', es: 'Problema de software', uk: 'Проблема з програмним забезпеченням' },
  'Other / not sure': { en: 'Other / not sure', pl: 'Inne / nie wiem', es: 'Otro / no estoy seguro', uk: 'Інше / не впевнений' }
};

export const bookText = {
  en: { eyebrow: 'Book repair', title: 'Book your repair.', intro: 'Choose your brand, model, issue, and preferred drop-off window. We will confirm the final schedule, pricing, and parts availability before you come in.', current: 'Current request', repairRequest: 'repair request', steps: ['Brand', 'Model', 'Issue', 'Contact', 'Send'], step: 'Step', brandTitle: 'What brand needs repair?', brandHint: 'Start with the device family. We support the major phone brands customers ask for most, plus an “Other” path when the model is not listed.', modelTitle: 'Find your model.', modelHint: 'Search, tap a popular model, or choose a series. We can identify the exact model in-store if you are not sure.', searchPlaceholder: 'Search model or model number', clear: 'Clear', searchResults: 'Search results', matching: 'matching models', selected: 'Selected', notListed: 'Device not listed', helpIdentify: 'We will help identify it', popular: 'Popular models', common: 'Most common', browse: 'Browse by series', chooseSeries: 'Choose a series', notSure: 'Not sure', issueTitle: 'What needs to be fixed?', issueHint: 'Choose the main issue. The visual panel will react to the selected problem.', contactTitle: 'Your contact details.', contactHint: 'Choose a preferred drop-off window during posted store hours. This is a request only — we will contact you to confirm the repair schedule.', name: 'Name', phone: 'Phone', email: 'Email', required: 'Required', date: 'Requested date', window: 'Preferred drop-off window', chooseWindow: 'Select an available store-hour window', chooseDate: 'Choose a date first', notes: 'Notes', notesPlaceholder: 'Example: Screen is cracked but touch still works.', consent: 'By sending this request, you agree that CellzTech / Cellz Repairz LLC may contact you about your repair request. This does not guarantee a confirmed appointment, repair price, part availability, or completion time.', finalTitle: 'Ready to send your repair request.', finalHint: 'This will send the request to CellzTech. We will contact you to confirm the drop-off window, price, and parts availability.', brand: 'Brand', series: 'Series', model: 'Model', issue: 'Issue', notSelected: 'Not selected', notProvided: 'Not provided', submit: 'Submit repair request', sending: 'Sending request...', textInstead: 'Text instead', callInstead: 'Call instead', backendNote: 'Your request is sent to CellzTech so we can review the device, issue, parts, and timing before confirming the repair details.', back: 'Back', next: 'Next step', startOver: 'Start over' },
  pl: { eyebrow: 'Zgłoszenie naprawy', title: 'Zgłoś naprawę.', intro: 'Wybierz markę, model, usterkę i preferowane okno oddania urządzenia. Przed wizytą potwierdzimy termin, cenę i dostępność części.', current: 'Aktualne zgłoszenie', repairRequest: 'zgłoszenie naprawy', steps: ['Marka', 'Model', 'Usterka', 'Kontakt', 'Wyślij'], step: 'Krok', brandTitle: 'Jaka marka wymaga naprawy?', brandHint: 'Zacznij od rodzaju urządzenia. Obsługujemy najpopularniejsze marki telefonów, a jeśli modelu nie ma na liście, wybierz ścieżkę „Inne”.', modelTitle: 'Znajdź swój model.', modelHint: 'Wyszukaj, wybierz popularny model albo serię. Jeśli nie masz pewności, pomożemy ustalić dokładny model w sklepie.', searchPlaceholder: 'Szukaj modelu lub numeru modelu', clear: 'Wyczyść', searchResults: 'Wyniki wyszukiwania', matching: 'pasujących modeli', selected: 'Wybrano', notListed: 'Urządzenia nie ma na liście', helpIdentify: 'Pomożemy je rozpoznać', popular: 'Popularne modele', common: 'Najczęstsze', browse: 'Przeglądaj według serii', chooseSeries: 'Wybierz serię', notSure: 'Nie wiem / nie mam pewności', issueTitle: 'Co trzeba naprawić?', issueHint: 'Wybierz główną usterkę. Panel wizualny dopasuje się do wybranego problemu.', contactTitle: 'Dane kontaktowe.', contactHint: 'Wybierz preferowane okno oddania urządzenia w godzinach pracy. To jest zgłoszenie — skontaktujemy się z Tobą, aby potwierdzić termin.', name: 'Imię i nazwisko', phone: 'Telefon', email: 'E-mail', required: 'Wymagane', date: 'Preferowana data', window: 'Preferowane okno oddania', chooseWindow: 'Wybierz dostępne okno w godzinach pracy', chooseDate: 'Najpierw wybierz datę', notes: 'Uwagi', notesPlaceholder: 'Przykład: Ekran jest pęknięty, ale dotyk działa.', consent: 'Wysyłając zgłoszenie, zgadzasz się, że CellzTech / Cellz Repairz LLC może skontaktować się z Tobą w sprawie naprawy. To nie gwarantuje potwierdzonej wizyty, ceny, dostępności części ani czasu ukończenia.', finalTitle: 'Gotowe do wysłania zgłoszenia.', finalHint: 'Zgłoszenie trafi do CellzTech. Skontaktujemy się, aby potwierdzić okno oddania, cenę i dostępność części.', brand: 'Marka', series: 'Seria', model: 'Model', issue: 'Usterka', notSelected: 'Nie wybrano', notProvided: 'Nie podano', submit: 'Wyślij zgłoszenie', sending: 'Wysyłanie zgłoszenia...', textInstead: 'Wyślij SMS', callInstead: 'Zadzwoń', backendNote: 'Zgłoszenie trafia do CellzTech, abyśmy mogli sprawdzić urządzenie, usterkę, części i termin przed potwierdzeniem szczegółów naprawy.', back: 'Wstecz', next: 'Dalej', startOver: 'Zacznij od nowa' },
  es: { eyebrow: 'Solicitud de reparación', title: 'Solicita tu reparación.', intro: 'Elige la marca, el modelo, el problema y una ventana preferida para dejar el equipo. Confirmaremos el horario, el precio y la disponibilidad de piezas antes de que vengas.', current: 'Solicitud actual', repairRequest: 'solicitud de reparación', steps: ['Marca', 'Modelo', 'Problema', 'Contacto', 'Enviar'], step: 'Paso', brandTitle: '¿Qué marca necesita reparación?', brandHint: 'Empieza con la familia del dispositivo. Atendemos las marcas más solicitadas y también tenemos una opción “Otro” si el modelo no aparece.', modelTitle: 'Encuentra tu modelo.', modelHint: 'Busca, toca un modelo popular o elige una serie. Si no estás seguro, podemos identificar el modelo exacto en la tienda.', searchPlaceholder: 'Buscar modelo o número de modelo', clear: 'Borrar', searchResults: 'Resultados de búsqueda', matching: 'modelos encontrados', selected: 'Seleccionado', notListed: 'Dispositivo no listado', helpIdentify: 'Te ayudaremos a identificarlo', popular: 'Modelos populares', common: 'Más comunes', browse: 'Buscar por serie', chooseSeries: 'Elige una serie', notSure: 'No estoy seguro', issueTitle: '¿Qué se necesita reparar?', issueHint: 'Elige el problema principal. El panel visual reaccionará al problema seleccionado.', contactTitle: 'Tus datos de contacto.', contactHint: 'Elige una ventana preferida para dejar el equipo durante el horario publicado. Es una solicitud; te contactaremos para confirmar.', name: 'Nombre', phone: 'Teléfono', email: 'Correo electrónico', required: 'Requerido', date: 'Fecha solicitada', window: 'Ventana preferida para dejar el equipo', chooseWindow: 'Selecciona una ventana disponible', chooseDate: 'Primero elige una fecha', notes: 'Notas', notesPlaceholder: 'Ejemplo: La pantalla está rota, pero el táctil funciona.', consent: 'Al enviar esta solicitud, aceptas que CellzTech / Cellz Repairz LLC pueda contactarte sobre tu reparación. Esto no garantiza una cita confirmada, precio, disponibilidad de piezas ni tiempo de finalización.', finalTitle: 'Listo para enviar tu solicitud.', finalHint: 'Esto enviará la solicitud a CellzTech. Te contactaremos para confirmar la ventana, el precio y la disponibilidad de piezas.', brand: 'Marca', series: 'Serie', model: 'Modelo', issue: 'Problema', notSelected: 'No seleccionado', notProvided: 'No proporcionado', submit: 'Enviar solicitud', sending: 'Enviando solicitud...', textInstead: 'Enviar texto', callInstead: 'Llamar', backendNote: 'Tu solicitud se envía a CellzTech para revisar el dispositivo, el problema, las piezas y el horario antes de confirmar los detalles.', back: 'Atrás', next: 'Siguiente', startOver: 'Empezar de nuevo' },
  uk: { eyebrow: 'Заявка на ремонт', title: 'Надішліть заявку на ремонт.', intro: 'Виберіть бренд, модель, проблему та зручне вікно для здачі пристрою. Перед вашим візитом ми підтвердимо час, ціну та наявність деталей.', current: 'Поточна заявка', repairRequest: 'заявка на ремонт', steps: ['Бренд', 'Модель', 'Проблема', 'Контакт', 'Надіслати'], step: 'Крок', brandTitle: 'Який бренд потребує ремонту?', brandHint: 'Почніть із типу пристрою. Ми підтримуємо найпопулярніші бренди, а якщо моделі немає в списку, виберіть “Інше”.', modelTitle: 'Знайдіть свою модель.', modelHint: 'Скористайтеся пошуком, виберіть популярну модель або серію. Якщо не впевнені, ми визначимо точну модель у магазині.', searchPlaceholder: 'Пошук моделі або номера моделі', clear: 'Очистити', searchResults: 'Результати пошуку', matching: 'збігів моделей', selected: 'Вибрано', notListed: 'Пристрою немає в списку', helpIdentify: 'Ми допоможемо визначити модель', popular: 'Популярні моделі', common: 'Найчастіші', browse: 'Перегляд за серією', chooseSeries: 'Виберіть серію', notSure: 'Не впевнений', issueTitle: 'Що потрібно відремонтувати?', issueHint: 'Виберіть основну проблему. Візуальна панель зміниться відповідно до вибраної несправності.', contactTitle: 'Ваші контактні дані.', contactHint: 'Виберіть зручне вікно для здачі пристрою в робочі години. Це заявка — ми зв’яжемося з вами для підтвердження.', name: 'Ім’я', phone: 'Телефон', email: 'Електронна пошта', required: 'Обов’язково', date: 'Бажана дата', window: 'Зручне вікно для здачі', chooseWindow: 'Виберіть доступне вікно', chooseDate: 'Спочатку виберіть дату', notes: 'Примітки', notesPlaceholder: 'Приклад: Екран розбитий, але сенсор працює.', consent: 'Надсилаючи заявку, ви погоджуєтеся, що CellzTech / Cellz Repairz LLC може зв’язатися з вами щодо ремонту. Це не гарантує підтвердженого запису, ціни, наявності деталей або часу виконання.', finalTitle: 'Готово до надсилання заявки.', finalHint: 'Заявка буде надіслана до CellzTech. Ми зв’яжемося з вами, щоб підтвердити час, ціну та наявність деталей.', brand: 'Бренд', series: 'Серія', model: 'Модель', issue: 'Проблема', notSelected: 'Не вибрано', notProvided: 'Не вказано', submit: 'Надіслати заявку', sending: 'Надсилання заявки...', textInstead: 'Надіслати SMS', callInstead: 'Зателефонувати', backendNote: 'Ваша заявка надсилається до CellzTech, щоб ми перевірили пристрій, проблему, деталі та час перед підтвердженням ремонту.', back: 'Назад', next: 'Далі', startOver: 'Почати спочатку' }
};

type BookingEnhancementCopy = {
  noticeBadge: string;
  noticeTitle: string;
  noticeText: string;
  prefilled: string;
  sendingMessage: string;
  successMessage: string;
  errorMessage: string;
  hoursPrompt: string;
  hoursSummary: string;
  hoursConfirmation: string;
  progressAria: string;
};

export const bookingEnhancementCopy: Record<LanguageKey, BookingEnhancementCopy> = {
  en: {
    noticeBadge: 'REPAIR REQUEST, NOT INSTANT APPOINTMENT',
    noticeTitle: 'We confirm the repair details before you come in.',
    noticeText: 'Choose a preferred drop-off window. We will contact you to verify the time, price, part availability, and expected repair timing. No payment is collected on this page.',
    prefilled: 'We carried your selection into the request. You can change it at any step.',
    sendingMessage: 'Sending your repair request...',
    successMessage: 'Repair request sent. We will contact you to confirm the date, time, parts, and pricing.',
    errorMessage: 'We could not send the online request yet. Please use the text option or call the store.',
    hoursPrompt: 'Choose a date to see available request windows.',
    hoursSummary: 'Store hours: Mon–Fri 11:00 AM–7:00 PM, Sat 11:00 AM–3:00 PM, Sun closed.',
    hoursConfirmation: 'Times are request windows and still need confirmation from CellzTech.',
    progressAria: 'Repair request progress'
  },
  pl: {
    noticeBadge: 'ZGŁOSZENIE NAPRAWY, NIE NATYCHMIASTOWA REZERWACJA',
    noticeTitle: 'Potwierdzamy szczegóły naprawy przed wizytą.',
    noticeText: 'Wybierz preferowane okno oddania urządzenia. Skontaktujemy się, aby potwierdzić termin, cenę, dostępność części i przewidywany czas naprawy. Na tej stronie nie pobieramy płatności.',
    prefilled: 'Przenieśliśmy Twój wybór do zgłoszenia. Możesz go zmienić na każdym etapie.',
    sendingMessage: 'Wysyłanie zgłoszenia naprawy...',
    successMessage: 'Zgłoszenie zostało wysłane. Skontaktujemy się, aby potwierdzić datę, godzinę, części i cenę.',
    errorMessage: 'Nie udało się jeszcze wysłać zgłoszenia online. Wyślij SMS albo zadzwoń do sklepu.',
    hoursPrompt: 'Wybierz datę, aby zobaczyć dostępne okna oddania.',
    hoursSummary: 'Godziny: pon.–pt. 11:00 AM–7:00 PM, sob. 11:00 AM–3:00 PM, niedz. zamknięte.',
    hoursConfirmation: 'Podane godziny są prośbą i wymagają potwierdzenia przez CellzTech.',
    progressAria: 'Postęp zgłoszenia naprawy'
  },
  es: {
    noticeBadge: 'SOLICITUD DE REPARACIÓN, NO CITA INSTANTÁNEA',
    noticeTitle: 'Confirmamos los detalles antes de que vengas.',
    noticeText: 'Elige una ventana preferida para dejar el equipo. Te contactaremos para confirmar el horario, el precio, la disponibilidad de piezas y el tiempo estimado. No se cobra en esta página.',
    prefilled: 'Llevamos tu selección a la solicitud. Puedes cambiarla en cualquier paso.',
    sendingMessage: 'Enviando tu solicitud de reparación...',
    successMessage: 'Solicitud enviada. Te contactaremos para confirmar la fecha, la hora, las piezas y el precio.',
    errorMessage: 'No pudimos enviar la solicitud en línea. Usa la opción de texto o llama a la tienda.',
    hoursPrompt: 'Elige una fecha para ver las ventanas disponibles.',
    hoursSummary: 'Horario: lun.–vie. 11:00 AM–7:00 PM, sáb. 11:00 AM–3:00 PM, dom. cerrado.',
    hoursConfirmation: 'Las horas son ventanas solicitadas y todavía necesitan confirmación de CellzTech.',
    progressAria: 'Progreso de la solicitud de reparación'
  },
  uk: {
    noticeBadge: 'ЗАЯВКА НА РЕМОНТ, НЕ МИТТЄВИЙ ЗАПИС',
    noticeTitle: 'Ми підтвердимо деталі ремонту до вашого візиту.',
    noticeText: 'Виберіть зручне вікно для здачі пристрою. Ми зв’яжемося з вами, щоб підтвердити час, ціну, наявність деталей і орієнтовний строк ремонту. На цій сторінці оплата не стягується.',
    prefilled: 'Ми перенесли ваш вибір у заявку. Його можна змінити на будь-якому кроці.',
    sendingMessage: 'Надсилання заявки на ремонт...',
    successMessage: 'Заявку надіслано. Ми зв’яжемося з вами, щоб підтвердити дату, час, деталі та ціну.',
    errorMessage: 'Не вдалося надіслати онлайн-заявку. Скористайтеся SMS або зателефонуйте до магазину.',
    hoursPrompt: 'Виберіть дату, щоб побачити доступні вікна.',
    hoursSummary: 'Години: пн.–пт. 11:00 AM–7:00 PM, сб. 11:00 AM–3:00 PM, нд. зачинено.',
    hoursConfirmation: 'Це запитувані вікна, які ще має підтвердити CellzTech.',
    progressAria: 'Прогрес заявки на ремонт'
  }
};

