import React, { useState } from 'react';

import { Modal } from 'react-native';

import { useForm } from 'react-hook-form';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
// import { Input } from '../../components/Form/Input';
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

type TransactionType = "up" | "down";

interface FormData {
    name: string;
    amount: string;
}

export function Register() {

    const [transactionType, setTransactionType] = useState<TransactionType | ''>('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {
        control,
        handleSubmit,
    } = useForm();

    function handleTransactionsTypesSelect(type: TransactionType) {
        setTransactionType(type);
    };

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    };

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    };

    function handleRegister(form: FormData) {

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }

        console.log(data)
    }

    return (
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
                    />

                    <InputForm
                        name="amount"
                        control={control}
                        placeholder="Preço"
                    />

                    <TransactionsTypes>
                        <TransactionTypeButton
                            type="up"
                            title="Income"
                            onPress={() => handleTransactionsTypesSelect('up')}
                            isActive={transactionType === 'up'}
                        />

                        <TransactionTypeButton
                            type="down"
                            title="Outcome"
                            onPress={() => handleTransactionsTypesSelect('down')}
                            isActive={transactionType === 'down'}
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
    );
}