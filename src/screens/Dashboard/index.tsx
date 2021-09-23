import React from 'react';
import {
    Container,
    Header,
    UserInfo,
    UserWrapper,
    Avatar,
    User,
    UserGreeting,
    UserName
} from './styles';

export function Dashboard() {

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Avatar source={{ uri: 'https://avatars.githubusercontent.com/u/56945282?v=4' }} />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Julio</UserName>
                        </User>
                    </UserInfo>
                </UserWrapper>
            </Header>
        </Container >
    )
}
