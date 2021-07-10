
// import './styles.module.scss';
//styles.module.scss -> module garante que  esta estilizalçao destas classes pertencem apenas para este file
import styles from './styles.module.scss';

import format from 'date-fns/format';  //documentação em date-fns.org
import ptBR from 'date-fns/locale/pt-BR';


export function Header() { //export sem default habilita auto import do SC Code de forma mais responsiva

    // const currentDate = new Date().toLocaleDateString();
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,
    })


    return (
        // <header className="headerContainer">
        <header className={styles.headerContainer}>

            <img src="/logo.svg" alt="NerdPodcast" />

            <p>O melhor que voce pode ouvir, sempre.</p>

            <span>{currentDate}</span>
        </header>

        
    )
}


