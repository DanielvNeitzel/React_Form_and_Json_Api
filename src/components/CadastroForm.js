// src/components/CadastroForm.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { format } from 'date-fns';
import { Modal, Button } from 'react-bootstrap';

const CadastroForm = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState(null);
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [showDialogError, setShowDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleFormReset = () => {
    setNome('');
    setSobrenome('');
    setDataNascimento(null);
    setEmail('');
    setCpf('');
    setCep('');
    setEndereco('');
    setNumero('');
    setCidade('');
    setBairro('');
    setComplemento('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cadastroData = {
      nome,
      sobrenome,
      dataNascimento: dataNascimento ? format(dataNascimento, 'dd/MM/yyyy') : '',
      email,
      cpf,
      cep,
      endereco,
      numero,
      cidade,
      bairro,
      complemento,
      dataHoraCadastro: format(new Date(), 'dd/MM/yyyy HH:mm'),
    };

    try {
      const response = await axios.post('http://localhost:3001/api/cadastro', cadastroData);
      console.log('Cadastro enviado com sucesso para o servidor:', response.data.message);
      setShowDialog(false);
      setAlertMessage('Cadastro realizado com sucesso.');
      handleFormReset();
    } catch (error) {
      console.error('Erro ao enviar cadastro para o servidor:', error);
      setShowDialog(true);
      setAlertMessage('');
    }
  };

  const handleCepChange = async (e) => {
    const cepValue = e.target.value.replace(/\D/g, '');
    setCep(cepValue);

    if (cepValue.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepValue}/json/`);
        setEndereco(response.data.logradouro);
        setNumero(response.data.numero || '');
        setCidade(response.data.localidade);
        setBairro(response.data.bairro);
        setComplemento(response.data.complemento || '');
      } catch (error) {
        console.error('Erro ao obter informações do CEP:', error);
        setEndereco('Endereço não encontrado');
        setNumero('');
        setCidade('');
        setBairro('');
        setComplemento('');
      }
    } else {
      setEndereco('');
      setNumero('');
      setCidade('');
      setBairro('');
      setComplemento('');
    }
  };

  return (
    <div>
      <Modal show={showDialogError} onHide={handleCloseDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Erro de Cadastro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Já existe um cadastro para esse E-mail.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDialog}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
      <form className="container mt-4" onSubmit={handleSubmit}>
      {alertMessage && (
        <div className="alert alert-success" role="alert">
          {alertMessage}
        </div>
      )}
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome:
          </label>
          <input
            type="text"
            className="form-control"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sobrenome" className="form-label">
            Sobrenome:
          </label>
          <input
            type="text"
            className="form-control"
            id="sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dataNascimento" className="form-label">
            Data de Nascimento:
          </label>
          <div className="d-grid gap-2">
            <DatePicker
              selected={dataNascimento}
              onChange={(date) => setDataNascimento(date)}
              className="form-control"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            E-mail:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpf" className="form-label">
            CPF:
          </label>
          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cep" className="form-label">
            CEP:
          </label>
          <InputMask
            mask="99999-999"
            value={cep}
            onChange={handleCepChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endereco" className="form-label">
            Endereço:
          </label>
          <input type="text" className="form-control" id="endereco" value={endereco} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="numero" className="form-label">
            Número:
          </label>
          <input
            type="text"
            className="form-control"
            id="numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cidade" className="form-label">
            Cidade:
          </label>
          <input
            type="text"
            className="form-control"
            id="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bairro" className="form-label">
            Bairro:
          </label>
          <input
            type="text"
            className="form-control"
            id="bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="complemento" className="form-label">
            Complemento:
          </label>
          <input
            type="text"
            className="form-control"
            id="complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary" >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroForm;
