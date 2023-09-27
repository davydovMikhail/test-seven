import s from './heading.module.scss';

function Heading() {

    return (
        <div className={s.heading}>
            <div className={s.heading__item}>
                Уровень
            </div>
            <div className={s.heading__item}>
                Наименование работ
            </div>
            <div className={s.heading__item}>
                Основная з/п
            </div>
            <div className={s.heading__item}>
                Оборудование
            </div>
            <div className={s.heading__item}>
                Накладные расходы
            </div>
            <div className={s.heading__item}>
                Сметная прибыль
            </div>
        </div>
    ) 
    
  }

export default Heading;