describe('Funcionalidade de Extrato', () => {
    it('TTCW-7: Verificar registro de transferência no extrato', () => {
        const usuarioExtrato = { nome: 'QA Extrato', email: `extrato.${Date.now()}@bugbank.com`, senha: '123' };
        cy.cadastro(usuarioExtrato.nome, usuarioExtrato.email, usuarioExtrato.senha);
        cy.login(usuarioExtrato.email, usuarioExtrato.senha);

        // Validação (deve haver saldo inicial de 1000 pelo padrão do sistema)
        cy.get('#btn-EXTRATO').click();
        cy.contains('Saldo disponível').should('be.visible');
        cy.contains('R$ 1.000,00').should('be.visible');
    });
});