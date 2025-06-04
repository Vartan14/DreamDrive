export interface Question {
  id: number;
  question_number: string;
  text: string;
  image?: string;
  topic: string;
  answers: Answer[];
  selected?: boolean;
}

export interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

export const topic = ["Пішохідні переходи", "Дорожні знаки", "Обмеження швидкості", "Повороти"];


export const questions: Question[] = [
   {
        id: 3577,
        question_number: "1652",
        text: "Під'їжджаючи до пішохідного переходу без світлофора, ви повинні:",
        topic: "Пішохідні переходи",
        answers: [
          {
            id: 11380,
            text: "Прискоритися, щоб швидко проїхати.",
            is_correct: false
          },
          {
            id: 11381,
            text: "Зберігати швидкість, але бути готовим зупинитися.",
            is_correct: false
          },
          {
            id: 11382,
            text: "Знизити швидкість і бути готовим зупинитися для пішоходів.",
            is_correct: true
          },
          {
            id: 11383,
            text: "Зупинятися лише якщо пішоходи вже переходять.",
            is_correct: false
          }
        ]
      },
      {
        id: 3578,
        question_number: "1653",
        text: "Які дії потрібно виконати, побачивши цей дорожній знак?",
        topic: "Дорожні знаки",
        image: "http://localhost:8001/media/questions/1653_srwCIQz.png",
        answers: [
          {
            id: 11384,
            text: "Знизити швидкість і їхати, якщо шлях вільний.",
            is_correct: false
          },
          {
            id: 11385,
            text: "Повністю зупинитися і рухатися лише коли це безпечно.",
            is_correct: true
          },
          {
            id: 11386,
            text: "Дати дорогу транспорту на головній дорозі.",
            is_correct: false
          },
          {
            id: 11387,
            text: "Зупинятися лише якщо наближається транспорт.",
            is_correct: false
          }
        ]
      },
      {
        id: 3579,
        question_number: "1654",
        text: "Яке обмеження швидкості у житловій зоні, якщо не вказано інше?",
        topic: "Обмеження швидкості",
        answers: [
          {
            id: 11388,
            text: "30 км/год",
            is_correct: false
          },
          {
            id: 11389,
            text: "50 км/год",
            is_correct: true
          },
          {
            id: 11390,
            text: "60 км/год",
            is_correct: false
          },
          {
            id: 11391,
            text: "70 км/год",
            is_correct: false
          }
        ]
      },
      {
        id: 3580,
        question_number: "1655",
        text: "Повертаючи праворуч, ви повинні:",
        topic: "Повороти",
        answers: [
          {
            id: 11392,
            text: "Завчасно подати сигнал, зайняти праву смугу і повертати з правої смуги.",
            is_correct: true
          },
          {
            id: 11393,
            text: "Подати сигнал в останній момент і повертати з будь-якої смуги.",
            is_correct: false
          },
          {
            id: 11394,
            text: "Завчасно подати сигнал, залишатися в лівій смузі і повертати через потік.",
            is_correct: false
          },
          {
            id: 11395,
            text: "Сигнал для повороту праворуч не потрібен.",
            is_correct: false
          }
        ]
      },
       {
        id: 3576,
        question_number: "1651",
        text: "Що означає цей дорожній знак?",
        topic: "Дорожні знаки",
        image: "http://localhost:8001/media/questions/1651_Rwl3USB.png",
        answers: [
          {
            id: 11376,
            text: "Дорога з виділеною смугою для руху транспортних засобів і велосипедистів за певним маршрутом.",
            is_correct: true
          },
          {
            id: 11377,
            text: "Дорога, де велосипедистам заборонено рух.",
            is_correct: false
          },
          {
            id: 11378,
            text: "Попередження, що на дорозі можуть бути велосипедисти.",
            is_correct: false
          },
          {
            id: 11379,
            text: "Окрема велосипедна доріжка, відокремлена від дороги.",
            is_correct: false
          }
        ]
      }

] 
