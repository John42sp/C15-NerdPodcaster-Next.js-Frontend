import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContext';

//slug: um tipo de renderização do next.js que coloca alguma propriedade do json na url, aqui é usando'title'
//usado para renderizar um perfil detalhado de um episodio do app

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    members: string,
    publishedAt: string, 
    duration: number, 
    durationAsString: string,
    url: string,
    description: string,
}

type EpisodeProps = {
    episode: Episode;
}


export default function Episode({ episode }: EpisodeProps) {

    //ao invez de criar novo useContext()feito em cada arquivo, usando usePlayer criado no PlayerContext.tsx
    //ao inves de:  const { } = useContext(PlayerContext);
    const { play } = usePlayer();

    // const router = useRouter(); //so pode usar hooks dentro de componentes, ou seja aqui. Não na função abaixo

    //no fallback: true, uma simples validação pra previnir erro ao executar efeito do fallback na build
    // if(router.isFallback) {   
    //     return <p>Carregando...</p> 
    // }


    return (
        // <h1>{router.query.slug}</h1>
        // <h1>{episode.title}</h1>

        <div className={styles.episode}>

            <Head>
            <title>{episode.title} | NerdPodcaster</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                

                <Image 
                    width={600} 
                    height={150} 
                    src={episode.thumbnail} 
                    objectFit="cover" 
                />

                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>

            </div>

            <div>
                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>

                </header>

                {/* <div className={styles.description}> //final aula3, mudou 
                    {episode.desscription}
                </div> */}
                {/* caso vc não saiba de onde seus dados estao vindo, alguem pode injetar script na sua page */}
                <div 
                    className={styles.description} 
                    dangerouslySetInnerHTML={{ __html: episode.description }}
                />
            </div>

        </div>
    )
}

//quais episodios eu quero gerar de maneira estatica no momento da build (ficarão permanentemente):
export const getStaticPaths: GetStaticPaths = async () => {  //pode receber mais de um parametro!

    //digamos, definir os 2 ultimos arquivos de forma estatica permanente, todos demaissomento quando um usuario acessar 1ª vez, ficarao disponivel de forma estatica por um periodo
    const { data } = await api.get('episodes',{
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode=> {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {   //paths: [], vazio = não vai gerar nenhum episodio de forma estática no momento da build.
        // paths: [
        //     { params: { slug: "a-importancia-da-contribuicao-em-open-source" }}
        // ], 
        paths, //path: instrui quais episodios que  ficarão gerados de maneira estatica(prontos) p serem acessados
        fallback: 'blocking'  //e o resto,ficar de forma incremental = assim que alguem aceessar, ficarão esaticos
        //fallback: true = next so vai carregar os dados da pagina quando i usuario acessar elas
    }
}

//pra obter slug dos parametros dos episodios, usar contexto = ctx, dentro do qual tenho os params com o slug

export const getStaticProps: GetStaticProps = async (ctx) => { //ctx = contexto do next, traz prop params
    const { slug } = ctx.params; //slug = nome do arquivo

    const { data } = await api.get(`/episodes/${slug}`) //pegando os dados pela url

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        //aqui alterando formatação pra camerCase, adequando formato da data 
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }), 
        duration: Number(data.file.duration), //convertendo duração pra Numero
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),//info vem texto, conv Number
        description: data.description,
        url: data.file.url,
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, // 24 hrs
    }
}