import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export function Player() { 
    const audioRef = useRef<HTMLAudioElement>(); //useRef: acessar elementos html
    const [progress, setProgress] = useState(0); //ira armazenar quanto tempo em segundos o progresso percorreu

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        tooglePlay, 
        toogleLoop,
        toogleShuffle,
        setPlayingState, 
        playNext, 
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayerState
        } = useContext(PlayerContext);

    useEffect(() => { //função de efeito colateral: se valor isPlaying mudou(boleano), acontece alguma coisa 
        if(!audioRef.current) { //current = valor da referencia. Seeu nao tiver nada dentro deste audioRef
            return;             //não retornar nada
        }
        if(isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

//função definindo o tempo percorrido do audio no 1º span. 2º span dá o total de tempo do audio(valor fixo)
    function setUpProgressListener() {
        audioRef.current.currentTime = 0; //sempre que mudar audio, colocar, começar da estaca zero

        audioRef.current.addEventListener('timeupdate', () => { //evento timeupdate do typescrip
            setProgress(Math.floor(audioRef.current.currentTime)) //aqui vai retornar o tempo atual do player
        })
    }
    //função pro usuario arrastar o ponto do progresso
    function handleSeek(amount: number) { //amount = o montante da duração que user informou
        audioRef.current.currentTime = amount; //aqui vai tocar no audio
        setProgress(amount);//aqui vai mudar o pontinho do progresso,pra frente ou pra traz

    }

    function handleEpisodeEnded() { //função que se tiver proximo, ele vai tocar proximo,se não, vai limpar estado
        if(hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]; //se nao tiver nennhumepisodio tocando, episode estara vazio
                                                    //por isso as verificações abaixo

    return (
       <div className={styles.playerContainer}>
           <header>
               <img src="/playing.svg" alt="Tocando agora" />
               {/* //? verificador, caso não tenha nenhum episodio tocando  */}
               {/* <strong>Tocando agora {episode?.title} </strong>  */}
               <strong>Tocando agora</strong> 

           </header>

           {episode ? (
               <div className={styles.currentEpisode}>
                   <Image 
                        width={492} 
                        height={492} 
                        src={episode.thumbnail} 
                        objectFit="cover" 
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>

               </div>
           ) : (
               <div className={styles.emptyPlayer}>
               <strong>Selecione um podcast para ouvir</strong>
          </div>
           )}
        {/* se nao tiver episode, class empty, caso tenha, classe vazio (pra tirar efeito de opacidade) */}
           <footer className={!episode ? styles.empty : ""}>
               <div className={styles.progress}>
                   {/* <span>00:00</span> */}  
                   {/* progress sempre partirá do zero, nao precisa condicional como no span abaixo sobre zero */}
                   <span>{convertDurationToTimeString(progress)}</span> 


                   <div className={styles.slider}>

                    {episode ? (
                        <Slider 
                            max={episode.duration} //tempo total, junto com prop value abaixo 
                            value={progress} //junto com prop acima max, aqui para indicar o ponto percorrido
                            onChange={handleSeek} //função pro usuário arrastar o pontinho de progresso da barra slider
                            trackStyle={{ backgroundColor: '#04d361'}}
                            railStyle={{ backgroundColor: '#9f75ff' }}
                            handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                        />
                    ) : (
                        <div className={styles.emptySlider} />
                    )}                        
                   </div>

                   {/* <span>00:00</span> */}
                   <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span> 
                   {/* //verificação com ?, caso episode esteja vazio. interrogação primeiro verifica se existe */}
                        {/* interrogaçã fará com que ele nao tente acessar a propriedade 'duration', ou zero caso: 0*/}
               </div>

                {/* colocar tag audio( poderia ser em qualquer lugar, tendo 'episode', o autoplay toca)  */}
               { episode && (
                   <audio 
                    src={episode.url}
                    ref={audioRef}
                    loop={isLooping} //loop = modo em que o audio repete assim que termina 
                    //não tem tag chamada 'shuffle' dentro da tag audio, entao fazer função verificação no Player
                    //logica do shuffle dentro da função playNext(), onde esta isShuffling = apenas umvalor boleano
                    autoPlay
                    onEnded={handleEpisodeEnded}//prop em que uma função é executada quando episodio chega no final 
                    onPlay={() => setPlayingState(true)} //função adicional para alterar botoes pause/play 
                    onPause={() => setPlayingState(false)}//quando play/pause são clicados no "teclado" (f8)
                    onLoadedMetadata={setUpProgressListener}  //meu teclado não tem esta função
                   />    //ouvir função setUpMetaData (progresso do player)                                

               )}

               <div className={styles.buttons}>
                   <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1} 
                        onClick={toogleShuffle}
                        className={isShuffling ? styles.isActive : ""}
                    >
                       <img src="/shuffle.svg" alt="Embaralhar" />
                   </button>                                               
                   <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious} > 
                       <img src="/play-previous.svg" alt="Tocar anterior" />
                   </button>
                   <button 
                    type="button" 
                    className={styles.playButton}
                    disabled={!episode} 
                    onClick={tooglePlay}
                   >
                       {isPlaying ? (
                           <img src="/pause.svg" alt="Pausar" />
                       ) : (
                        <img src="/play.svg" alt="Tocar" />
                       )}
                   </button>
                   <button type="button" onClick={playNext} disabled={!episode || !hasNext} >
                       <img src="/play-next.svg" alt="Tocar proxima" />
                   </button>
                   <button 
                        type="button" 
                        disabled={!episode} 
                        onClick={toogleLoop}
                        className={isLooping ? styles.isActive : ""}
                    >
                       <img src="/repeat.svg" alt="Repetir" />
                   </button>


               </div>
           </footer>

       </div>

    )
}