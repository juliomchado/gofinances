import React, { useState } from 'react';

import {
    Keyboard,
    Modal,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';

import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { yupResolver } from '@hookform/resolvers/yup';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';


type TransactionType = "positive" | "negative";

interface FormData {
    name: string;
    amount: number;
}

interface NavigationProps {
    navigate: (screen: string) => void;
}

const schema = Yup.object().shape({
    name: Yup.string()
        .required('Nome é obrigatório'),
    amount: Yup.number()
        .typeError('Informe um valor numérico')
        .positive('O valor não pode ser negativo')
});

export function Register() {

    const defaultCategory = {
        key: 'category',
        name: 'Categoria',
    }

    const navigation = useNavigation<NavigationProps>();

    const [transactionType, setTransactionType] = useState<TransactionType | ''>('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState(defaultCategory);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionsTypesSelect(type: TransactionType) {
        setTransactionType(type);
    };

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    };

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    };

    async function handleRegister(form: FormData) {

        if (!transactionType)
            return Alert.alert('Selecione o tipo da transação');

        if (category.key === 'category')
            return Alert.alert('Selecione uma categoria');

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const collectionKey = '@gofinances:transactions';

            const data = await AsyncStorage.getItem(collectionKey);

            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ];

            console.log(category.key);

            await AsyncStorage.setItem(collectionKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory(defaultCategory)

            navigation.navigate('Listagem');
        } catch (err) {
            console.log(err);

            Alert.alert('Desculpa, não conseguimos salvar, por favor, tente novamente mais tarde');
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionsTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Entrada"
                                onPress={() => handleTransactionsTypesSelect('positive')}
                                isActive={transactionType === 'positive'}
                            />

                            <TransactionTypeButton
                                type="down"
                                title="Saída"
                                onPress={() => handleTransactionsTypesSelect('negative')}
                                isActive={transactionType === 'negative'}
                            />
                        </TransactionsTypes>

                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />

                        <Modal visible={categoryModalOpen}>
                            <CategorySelect
                                category={category}
                                setCategory={setCategory}
                                closeSelectCategory={handleCloseSelectCategoryModal}
                            />
                        </Modal>
                    </Fields>
                    <Button
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

            </Container>
        </TouchableWithoutFeedback>
    );
}