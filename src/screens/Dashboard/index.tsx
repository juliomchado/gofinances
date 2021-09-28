import React, { useState, useCallback, useEffect } from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

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
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
}

interface HighlightData {
    entries: HighlightProps;
    outs: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {

    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    async function loadTransactions() {
        const collectionKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(collectionKey);
        const storageTransactions = response ? JSON.parse(response) : [];

        if (storageTransactions.length > 0) {

            let entriesTotal = 0;
            let expensiveTotal = 0;

            const transactionsFormatted: DataListProps[] =
                storageTransactions.map((item: DataListProps) => {
                    const amountFormatted = formatAmountToReal(item.amount);
                    const dateFormatted = formatDate(item.date);

                    if (item.type === 'positive') {
                        entriesTotal += Number(item.amount);
                    } else {
                        expensiveTotal += Number(item.amount);
                    }

                    return {
                        id: item.id,
                        name: item.name,
                        amount: amountFormatted,
                        type: item.type,
                        category: item.category,
                        date: dateFormatted
                    }

                });

            const total = entriesTotal - expensiveTotal;

            setHighlightData({
                entries: {
                    amount: formatAmountToReal(entriesTotal)
                },
                outs: {
                    amount: formatAmountToReal(expensiveTotal)
                },
                total: {
                    amount: formatAmountToReal(total)
                }
            });

            setTransactions(transactionsFormatted);

        }
    }

    useEffect(() => {
        loadTransactions();
    }, [])

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [])
    );


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
                    amount={highlightData?.entries?.amount}
                    lastTransaction="Última entrada dia 13 de abril"
                />
                <HighlightCard
                    type="down"
                    title="Saídas"
                    amount={highlightData?.outs?.amount}
                    lastTransaction="Última entrada dia 03 de abril"
                />
                <HighlightCard
                    type="total"
                    title="Total"
                    amount={highlightData?.total?.amount}
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
