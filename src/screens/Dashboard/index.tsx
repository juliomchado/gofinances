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
import { Loading } from '../../components/Form/Loading';
import { useAuth } from './../../hooks/useAuth';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    outs: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const { signOut, user } = useAuth();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
    ) {
        const lastTransaction = new Date(
            Math.max.apply(Math, collection
                .filter(transaction => transaction.type === type)
                .map(transaction => new Date(transaction.date).getTime())))

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
    }

    async function loadTransactions() {
        const collectionKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(collectionKey);
        const storageTransactions = response ? JSON.parse(response) : [];


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


        setTransactions(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(storageTransactions, 'positive');
        const lastTransactionOuts = getLastTransactionDate(storageTransactions, 'negative');
        const totalInterval = `01 a ${lastTransactionOuts}`

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: formatAmountToReal(entriesTotal),
                lastTransaction: `Ùltima entrada dia ${lastTransactionEntries}`
            },
            outs: {
                amount: formatAmountToReal(expensiveTotal),
                lastTransaction: `Ùltima saída dia ${lastTransactionOuts}`

            },
            total: {
                amount: formatAmountToReal(total),
                lastTransaction: totalInterval
            }
        });

        setIsLoading(false);

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
            {isLoading ?
                (
                    <Loading />
                )
                : (
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Avatar source={{ uri: user.avatar }} />
                                    <User>
                                        <UserGreeting>Olá,</UserGreeting>
                                        <UserName>{user.name}</UserName>
                                    </User>
                                </UserInfo>
                                <LogoutButton onPress={signOut}>
                                    <Icon name="power" />
                                </LogoutButton>
                            </UserWrapper>
                        </Header>

                        <HighlightCards>
                            <HighlightCard
                                type="up"
                                title="Entradas"
                                amount={highlightData.entries.amount}
                                lastTransaction={highlightData.entries.lastTransaction}
                            />
                            <HighlightCard
                                type="down"
                                title="Saídas"
                                amount={highlightData.outs.amount}
                                lastTransaction={highlightData.outs.lastTransaction}
                            />
                            <HighlightCard
                                type="total"
                                title="Total"
                                amount={highlightData.total.amount}
                                lastTransaction={highlightData.total.lastTransaction}
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

                    </>
                )}
        </Container >
    )
}
