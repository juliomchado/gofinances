import React, { useState, useEffect } from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    Container,
    Header,
    UserInfo,
    LogoutButton,
    UserWrapper,
    Avatar,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Title,
    TransactionList,
    Transactions,
} from './styles';

import { formatAmountToReal } from '../../utils/formatAmountToReal';
import { formatDate } from '../../utils/formatDate';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const collectionKey = '@gofinances:transactions';

    const [transactions, setTransactions] = useState<DataListProps[]>([]);[

    ]
    async function loadTransactions() {
        const response = await AsyncStorage.getItem(collectionKey);

        const storageTransactions = response ? JSON.parse(response) : [];

        if (storageTransactions.length > 0) {
            const transactionsFormatted: DataListProps[] = storageTransactions.map((item: DataListProps) => {
                const amountFormatted = formatAmountToReal(item.amount);
                const dateFormatted = formatDate(item.date);
                console.log(item)

                return {
                    id: item.id,
                    name: item.name,
                    amount: amountFormatted,
                    type: item.type,
                    category: item.category,
                    date: dateFormatted
                }

            });

            console.log(transactionsFormatted)

            setTransactions(transactionsFormatted);

        }
    }

    useEffect(() => {

        loadTransactions();
    }, [])


    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Avatar source={{ uri: 'https://avatars.githubusercontent.com/u/56945282?v=4' }} />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Julio Machado</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton onPress={() => { }}>
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard
                    type="up"
                    title="Entradas"
                    amount="R$ 17.400,00"
                    lastTransaction="Última entrada dia 13 de abril"
                />
                <HighlightCard
                    type="down"
                    title="Saídas"
                    amount="R$ 1.259,00"
                    lastTransaction="Última entrada dia 03 de abril"
                />
                <HighlightCard
                    type="total"
                    title="Total"
                    amount="R$ 16.141,00"
                    lastTransaction="01 à 16 de abril"
                />
            </HighlightCards>


            <Transactions>
                <Title>Listagem</Title>
                <TransactionList
                    data={transactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}

                />
            </Transactions>

        </Container >
    )
}
