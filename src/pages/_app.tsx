import "../styles/global.scss";
import styles from "../styles/app.module.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerContextProvider } from "../contexts/PlayerContext";

//este arquivo do next para que componentes fiquem em todas paginas da aplicação.
//header e players estarão presentes em todas telas da aplicação 
function MyApp({ Component, pageProps }) { 
  // return <Component {...pageProps} />  //Component = componente da rota em si (index sendo renderizado)

  //O player ficara na mesma pagina principal, porem na lateral direita, de cima em baixo, entao css pra este 
  //arquivo: app.scss no styles gerais

  return (

    //TIROU TODO CODIGO ENVOLVENDO O <PlayerContext.Provider E COLOCOU NUM COMPONENTE NO PlayerContext.tsx
    //aqui tbm funcionaria, mas se tivesse que adicionar outros contextos, ficaria uma massaroca.
    //e colocou o componenteem colta  da div abaixo:
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />    
        </main>
        <Player />
      </div>    
    </PlayerContextProvider>
  )

}

export default MyApp
