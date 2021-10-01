import React from 'react';
import { Alert } from 'react-native';

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

export function SignIn() {
    const { signInWithGoogle, signInWithApple } = useAuth();

    async function handleSignInWithGoogle() {
        try {

            await signInWithGoogle();

        } catch (err) {

            console.log(err);

            Alert.alert('Não foi possível contectar a conta Google');
        }

    }

    async function handleSignInWithApple() {
        try {

            await signInWithApple();

        } catch (err) {

            console.log(err);

            Alert.alert('Não foi possível contectar a conta Apple');
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
                    <SignInSocialButton
                        title="Entrar com Apple"
                        svg={AppleSvg}
                        onPress={handleSignInWithApple}
                    />
                </FooterWrapper>

            </Footer>

        </Container>
    )
};