import styled from 'styled-components/native';
import { Text } from 'react-native';

// type ContainerProps = {
//     theme: {
//         colors: {
//             primary: string;
//         }
//     }
// }

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;

    background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.title};
`;