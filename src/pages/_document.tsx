//arquivo  que criamos: determina qual formato do html em nossa app, feito assim no nextjs
//em projeto react, vem com arquivo index.html,no nextjs temos que escrever codigo abaixo
//tudo é documentação do nextjs

import Document, { Html, Main, Head, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
                    {/* colocando favicon na aba da pagina (todas pages). o title será diferente, colocando no index */}
                    <link rel="shortcut icon" href="favicon.png" type="image/png" /> 
                </Head>
                <body>
                    <Main/> 

                    <NextScript/>
                </body>

            </Html>
        )
    }
}