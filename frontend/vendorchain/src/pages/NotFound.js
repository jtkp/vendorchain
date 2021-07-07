import React from 'react';
import { Container } from '@material-ui/core';
import Title from '../components/Titles/Title';
import Subtitle from '../components/Titles/Subtitle';

const NotFound = () => {
  return (
    <Container>
        <Title>
          404 Not Found
        </Title>
        <Subtitle>
          Opps! Page not exists :O
        </Subtitle>
    </Container>
  );
};

export default NotFound;
