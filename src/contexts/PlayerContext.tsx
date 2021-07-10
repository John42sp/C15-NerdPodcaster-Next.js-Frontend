import { createContext, ReactNode, useContext, useState } from 'react';

// export const PlayerContext = createContext(''); //context salvando apenas um formato de informação(string)

type Episode = {   //colocar apenas as infos do Episodo a serem usadas no Player
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    //por ter no Player botões de anterior e proximo, entao definimos 'lista de episodios
    //por ser array, vou dividir em dois objetos de tipagem
    episodeList: Episode[];
    currentEpisodeIndex: number;   //tbm colocar indice atual do episodio tocando= colocandoem qual posição da lista  Episode[] o episodio que esta tocando 
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;  //na tipagem tbm adicionar a função play, que não tem retorno = é void
    playList: (list: Episode[], index: number) => void;  
    setPlayingState: (state: boolean) => void;
    tooglePlay: () => void;  
    toogleLoop: () => void; 
    toogleShuffle: () => void;  
    playNext: () => void;  
    playPrevious: () => void;  
    clearPlayerState: () => void;  
    hasNext: boolean;
    hasPrevious: boolean;
}

// export const PlayerContext = createContext({   //salvando o formato da informação
//     episodeList: [],
//     currentEpisodeIndex: 0,
// });

//passando a tipagem do player pro contexto
export const PlayerContext = createContext({} as PlayerContextData);

//typagem children dava 'any',  quando elemento pode ser qualquer coisa (div, texto, etc), usar ReactNode

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
    
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); //true= quando der play no episode, queroque saia tocando.
  const [isLooping, setIsLooping] = useState(false); 
  const [isShuffling, setIsShuffling] = useState(false); 


  function play(episode: Episode) { //função usada somente no slug, so tem um episode, não precisa index
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)  //forçar o valor do index pra zero, o que esteja tocando no momento
    setIsPlaying(true);
  }
//fazer tocar o episodio no index clicado de lista de episodios
  function playList(list: Episode[], index: number) { //usada na index, lista latestEpisode & allEpisode, precisa idx
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function tooglePlay() {
    setIsPlaying(!isPlaying)  // !isPlaying inverte o estado atual do isPlaying
  }

  function toogleLoop() {  //funçao habilitar modo 'repetir' assim que audio estiver terminado
    setIsLooping(!isLooping)  
  }

  function toogleShuffle() {
    setIsShuffling(!isShuffling)  
  }

  function setPlayingState(state: boolean) {  //função adicional criada para alterar botão play/pause quando 
    setIsPlaying(state)                       //play/pause é feito com botão do teclado (f8). Meu nao funciona
  }

  function clearPlayerState() { //para limpar o estado do player, como se nunca tivese tocado nenhum episodio
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length; //fazer hasNext funcionar tanto em modo aleatorio (isShuffling) ou se ainda houver um proximo episodio

  function playNext() { //não tem tag chamada 'shuffle' dentro da tag audio, entao fazer verificação no PlayerContext
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if(hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
      
  }

  function playPrevious() {      
    if(hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
    
}
  
  return (
    <PlayerContext.Provider 
        value={{ 
            episodeList, 
            currentEpisodeIndex, 
            play, 
            playList,
            playNext,
            playPrevious,
            isPlaying, 
            isLooping,
            isShuffling,
            tooglePlay, 
            toogleLoop,
            toogleShuffle,
            setPlayingState, 
            hasNext,
            hasPrevious,
            clearPlayerState
            }}
        >
        {children} 
    </PlayerContext.Provider>
  )
}
// children = fazendo repasse de todo conteudo dentro do componente, se não, o componente tera erro no _app.tsx

//criado para otimizar = assim não precisar importar useContext em cada arquivo. assim, foi feito somente aqui
export const usePlayer = () => {
  return useContext(PlayerContext)
}