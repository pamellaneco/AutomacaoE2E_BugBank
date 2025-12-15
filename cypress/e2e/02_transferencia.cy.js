describe('Funcionalidade de Transferência', () => {

  let contaDestino;

  beforeEach(() => {
    // Criar a Conta de Destino
    cy.visit('/');
    cy.contains('button', 'Registrar').click();
    
    cy.get('.card__register input[name="email"]').type(`destino.${Date.now()}@bugbank.com`, {force: true});
    cy.get('.card__register input[name="name"]').type('Destinatario', {force: true});
    cy.get('.card__register input[name="password"]').type('123', {force: true});
    cy.get('.card__register input[name="passwordConfirmation"]').type('123', {force: true});
    cy.get('#toggleAddBalance').click({force: true}); 
    cy.contains('button', 'Cadastrar').click({force: true});

    // Achar e salvar o número da conta pelo modal 
    cy.get('#modalText').invoke('text').then((textoModal) => {
      const match = textoModal.match(/conta (\d+)-(\d+)/i);
      expect(match).to.not.be.null;
      contaDestino = { numero: match[1], digito: match[2] };
    });

    // Fechar modal para deixar a tela pronta para outras ações
    cy.get('#btnCloseModal').click();
  });

  it('TTCW-5: Realizar transferência com saldo disponível', () => {
    const remetente = { nome: 'Remetente', email: `envia.${Date.now()}@bugbank.com`, senha: '123' };
    cy.cadastro(remetente.nome, remetente.email, remetente.senha);
    cy.login(remetente.email, remetente.senha);

    // Transferir
    cy.get('#btn-TRANSFERÊNCIA').click();
    cy.then(() => {
      cy.get('input[name="accountNumber"]').type(contaDestino.numero);
      cy.get('input[name="digit"]').type(contaDestino.digito);
    });
    cy.get('input[name="transferValue"]').type('100');
    cy.get('input[name="description"]').type('Transf Sucesso');
    cy.contains('button', 'Transferir agora').click();

    // Validação (sucesso)
    cy.get('#modalText').should('contain', 'Transferencia realizada com sucesso');
    cy.get('#btnCloseModal').click();
    cy.get('#btnBack').click();
    cy.contains('R$ 900,00').should('be.visible');
    cy.get('#btn-EXTRATO').click();
    cy.contains('Transf Sucesso').should('be.visible');
    cy.contains('-R$ 100,00').should('be.visible');
  });

  it('TTCW-6: Validar bloqueio de transferência com valor superior ao saldo', () => {
    const usuarioSaldoInsuficiente = { nome: 'QA SaldoInsuficiente', email: `SaldoInsuficiente.${Date.now()}@bugbank.com`, senha: '123' };
    cy.cadastro(usuarioSaldoInsuficiente.nome, usuarioSaldoInsuficiente.email, usuarioSaldoInsuficiente.senha);
    cy.login(usuarioSaldoInsuficiente.email, usuarioSaldoInsuficiente.senha);

    // Tentar Transferir
    cy.get('#btn-TRANSFERÊNCIA').click();
    cy.then(() => {
      cy.get('input[name="accountNumber"]').type(contaDestino.numero);
      cy.get('input[name="digit"]').type(contaDestino.digito);
    });
    cy.get('input[name="transferValue"]').type('2000'); 
    cy.get('input[name="description"]').type('Teste Sem Saldo');
    cy.contains('button', 'Transferir agora').click();

    // Validação (não deve permitir)
    cy.get('#modalText').should('contain', 'saldo suficiente'); 
    cy.get('#btnCloseModal').click();
  });
});
