import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';

import LogoSvg from '../../assets/logo.svg';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles';

import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SigInSocialButton';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../../components/Form/Loading';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);

    const { signInWithGoogle, signInWithApple } = useAuth();

    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true)
            return await signInWithGoogle();

        } catch (err) {
            console.log(err);

            Alert.alert('Não foi possível contectar a conta Google');
            setIsLoading(false);
        }


    }

    async function handleSignInWithApple() {
        try {
            setIsLoading(true)
            return await signInWithApple();

        } catch (err) {
            console.log(err);

            Alert.alert('Não foi possível contectar a conta Apple');
            setIsLoading(false);
        }


    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}

                    />

                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Faça seu login com {'\n'}
                    umas das contas abaixo
                </SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title="Entrar com Google"
                        svg={GoogleSvg}
                        onPress={handleSignInWithGoogle}
                    />
                    {Platform.OS === 'ios' && (
                        <SignInSocialButton
                            title="Entrar com Apple"
                            svg={AppleSvg}
                            onPress={handleSignInWithApple}
                        />
                    )}

                </FooterWrapper>

                {isLoading && <Loading />}

            </Footer>

        </Container>
    )
};