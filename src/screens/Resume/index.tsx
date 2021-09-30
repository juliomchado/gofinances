import React, { useCallback, useState, useEffect } from 'react';


import AsyncStorage from '@react-native-async-storage/async-storage';

import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { HistoryCard } from '../../components/HistoryCard';
import {
    Container,
    Title,
    Header,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
} from './styles';

import { categories } from './../../utils/categories';
import { formatAmountToReal } from '../../utils/formatAmountToReal';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths } from 'date-fns';
import { formatMonthSelectDate } from '../../utils/formatMonthSelectDate';
import { Loading } from '../../components/Form/Loading';
import { useFocusEffect } from '@react-navigation/native';

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
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

interface DateProps {
    date: Date;
    formattedDate: string;
}



export function Resume() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<DateProps>({
        date: new Date(),
        formattedDate: formatMonthSelectDate(new Date())
    });

    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();


    function handleDateChange(action: 'next' | 'prev') {

        if (action === 'next') {

            const newDate = addMonths(selectedDate.date, 1);
            const newFormattedDate = formatMonthSelectDate(newDate);

            const newStateDate = {
                date: newDate,
                formattedDate: newFormattedDate,
            }

            setSelectedDate(newStateDate);

        } else {
            const newDate = subMonths(selectedDate.date, 1);
            const newFormattedDate = formatMonthSelectDate(newDate);
            const newStateDate = {
                date: newDate,
                formattedDate: newFormattedDate,
            }

            setSelectedDate(newStateDate);
        }

    }


    async function loadData() {
        setIsLoading(true);

        const collectionKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(collectionKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted.
            filter((expensive: TransactionData) =>
                expensive.type === 'negative'
                && new Date(expensive.date).getMonth() === selectedDate.date.getMonth()
                && new Date(expensive.date).getFullYear() === selectedDate.date.getFullYear()
            );

        const expensivesTotal = expensives
            .reduce((accumulator: number, expensive: TransactionData) => {
                return accumulator + Number(expensive.amount);
            }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            })

            if (categorySum > 0) {
                const totalFormatted = formatAmountToReal(categorySum);

                const percent = `${(categorySum / expensivesTotal * 100)
                    .toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormatted,
                    color: category.color,
                    percent
                });
            }

        });

        setTotalByCategories(totalByCategory);
        setIsLoading(false);

    }

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [selectedDate])
    );

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            {isLoading ? (
                <Loading />
            ) : (
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight() + 8,
                    }}

                >
                    
                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleDateChange('prev')}>
                            <MonthSelectIcon name="chevron-left" />
                        </MonthSelectButton>

                        <Month>{selectedDate.formattedDate}</Month>

                        <MonthSelectButton onPress={() => handleDateChange('next')}>

                            <MonthSelectIcon name="chevron-right" />
                        </MonthSelectButton>
                    </MonthSelect>

                    <ChartContainer>
                        <VictoryPie
                            data={totalByCategories}
                            colorScale={totalByCategories.map(category => category.color)}
                            style={{
                                labels: {
                                    fontSize: RFValue(18),
                                    fontWeight: 'bold',
                                    fill: theme.colors.shape
                                }
                            }}
                            labelRadius={70}

                            x="percent"
                            y="total"
                        />
                    </ChartContainer>
                    {totalByCategories.map(category => (
                        <HistoryCard
                            key={category.key}
                            title={category.name}
                            amount={category.totalFormatted}
                            color={category.color}
                        />
                    ))}



                </Content>
            )}

        </Container >
    )
}