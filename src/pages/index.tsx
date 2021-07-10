
// import { Header } from "../components/Header";

//componentes presentes em todas paginas (header, player) ficarão no arquivo _app.tsx, não mais aqui n index.tsx

import { GetStaticProps } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string, 
  duration: number, 
  durationAsString: string,
  url: string,
}

type HomeProps = {  //tipagem do props: array de objetos com propriedades tais...
  // episodes: Episode[]
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  //FUNÇÃO DA CONTEXT API NESTA APP: carregar o episodio selevionado da index.tsx na Player, pra tocar

  const { playList } = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    // <Header />
  <div className={styles.homepage}>      
    {/* <p>{JSON.stringify(props.episodes)}</p>  */}

    <Head>
      <title>Home | NerdPodcaster</title>
    </Head>

    <section className={styles.latestEpisodes}>
      <h2>Últimos lançamentos</h2>

      <ul>
        {/* metodo forEach percorre algo mas não tem retorno dentro, o map tem retorno */}
        {latestEpisodes.map((episode, index) => {
          return (
            <li key={episode.id}>
               <Image  //componente do next para otimização de carregamento de imagem que for destaque
                  width={192}   //imgens vindo de google.api, arquivo next.config.js aula 3, 43mnts
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

              <div className={styles.episodeDetails}>

                {/* <a href={`/episodes/${episode.id}`}>{episode.title}</a> */}

                {/* para carregamento mais rapido, usar Link e colocar href no Link */}
                {/* vai gerar url com o episode especifico, e no arquivo slug, será o slugna url, para reqde dados */}
                <Link href={`/episodes/${episode.id}`}> 
                  <a >{episode.title}</a>
                </Link>

                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>

                <button type="button" onClick={()=> playList(episodeList, index)} >
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>

              </div>


            </li>
          )
        })}

      </ul>

    </section>

    <section className={styles.allEpisodes}>
      <h2>Todos episódios</h2>

      <table cellSpacing={0}>
        <thead>
         <tr>
         <th></th>
          <th>Podcast</th>
          <th>Integrantes</th>
          <th>Data</th>
          <th>Duração</th>
          <th></th>
         </tr>
        </thead>

        <tbody>
          {allEpisodes.map((episode, index) => {
            return (
              <tr key={episode.id}>
                <td style={{width:70}}>
                  <Image 
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                {/* colocando largura fixa nas tds */}
                <td style={{width: "40%"}}> 
                {/* Link href fara a renderização da page colocando o title na url, [slug].tsx */}
                  <Link href={`/episodes/${episode.id}`}> 
                  <a >{episode.title}</a>
                  </Link>
                  
                </td>
                <td style={{width: "30%"}}>{episode.members}</td>
                <td style={{width:100}}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button type="button" onClick={()=> playList(episodeList, index + latestEpisodes.length)} >
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>



              </tr>
            )
          })}
        </tbody>

      </table>
    </section>
  </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // const response = await fetch("http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc")
  // const data = await response.json();

  const { data } = await api.get("episodes", {  //usando axios
    params: {
      _limit: 12,  //limitando renderização em 12 itens
      _sort: "published_at",   //organizando renderização de acordo com data, começando do mais recente
      _order: "desc"
    }
  })
//fazer formatação de dados antes de chegar ao return, pra não forçar renderização novamente
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      //aqui alterando formatação pra camerCase, adequando formato da data 
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }), 
      duration: Number(episode.file.duration), //convertendo duração pra Numero
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),//info vem texto, conv Number
      url: episode.file.url,
    }
  })
//tornando o array 'episodes' vindo do servido em 2 tipos:
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      // episodes,
      latestEpisodes, 
      allEpisodes
    },
    revalidate: 60 * 60 * 8, //A cada 8hrs, quando uma pessoa acessar esta pagina, vai gerar nova versão dela
                             //ou seja, uma nova chamada a api vai ser feita, ou seja. 3 chamadas a api dia
                             //todas pessoas que acessarem esta page, vaiconsumir html estatico
  }
}
