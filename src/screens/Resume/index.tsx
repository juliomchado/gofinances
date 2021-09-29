import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../components/HistoryCard';
import {
    Container,
    Header,
    Content,
    Title
} from './styles';

import { categories } from './../../utils/categories';
import { formatAmountToReal } from '../../utils/formatAmountToReal';

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: string;
    color: string;
}

export function Resume() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    async function loadData() {
        const collectionKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(collectionKey);
        const responseFormatted = response ? JSON.parse(response) : [];


        const expensives = responseFormatted.
            filter((expensive: TransactionData) =>
                expensive.type === 'negative');

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            })

            if (categorySum > 0) {
                const total = formatAmountToReal(categorySum);

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total,
                    color: category.color
                });
            }

        });

        setTotalByCategories(totalByCategory);

    }

    useEffect(() => {
        loadData();

    }, []);

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            <Content
            >
                {totalByCategories.map(category => (
                    <HistoryCard
                        key={category.key}
                        title={category.name}
                        amount={category.total}
                        color={category.color}
                    />
                ))}
            </Content>


        </Container>
    )
}