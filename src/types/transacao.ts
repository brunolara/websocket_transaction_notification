enum TipoOperacao {

    BOLETO = 1,
    CARTAO_DEBITO = 2,
    CARTAO_CREDITO = 3,
    PIX = 4,
    DEPOSITO = 5,
    JUROS = 6,

    TRANSFERENCIA_EXTERNA_PIX = 7,
    TRANSFERENCIA_EXTERNA_TEDTEV = 11,

    TRANSFERENCIA_INTERNA = 8,
    PAGAMENTO_BOLETO = 9,
    PAGAMENTO_PIX = 10,

}
enum StatusTransacaoEnum {

    // PAGO
    PAGO = 2,
    BOLETO_LIQUIDADO_COMPENSADO = 3,
    FINALIZADO = 18,
    CONFIRMADO = 19,
    TRANSFERIDO = 16,
    AUTORIZADO = 6,

    // CANCELADO
    CANCELADO = 4,
    RECUSADO = 10,
    ESTORNADO = 8,
    AGUARDANDO_ESTORNO = 9,
    DEVOLVIDO = 11,
    SUSPENSO = 14,

    // EM PROCESSO
    EM_PROCESSO = 5,
    EM_DISPUTA = 15,
    AGUARDANDO_PAGAMENTO = 7,
    ANALISE = 12,
    REVISAO_PAGAMENTO = 13,
    NAO_PAGO = 17,
    BOLETO_REGISTRADO = 1,
}

interface IntegracaoDadosGerenciaNet{
    nomePessoa: string;
    banco: string;
    documento: string;
}

interface Transacao {
    id: number;
    valor: number;
    valorBruto: number;
    cotacao?: number;
    nossoNumero?: string;
    codigoDeBarra?: string;
    linhaDigitavel?: string;
    documento?: string;
    parcelas?: number;
    nomeCliente?: string;
    usuarioId: number;
    usuarioNome: string;
    estabelecimentoId?: number;
    pixChavePagamento?: string;
    pixEndToEnd?: string;
    tipoOperacao?: TipoOperacao;
    statusTransacao?: StatusTransacaoEnum;
    adquirenteStatusCode?: string;
    estabelecimentoRazaoSocial?: string;
    estabelecimentoNomeFantasia?: string;
    estabelecimentoCnpj?: string;
    creationDate?: Date;
    lastModified?: Date;
    categoria?: string;
    usuarioEstornoNome?: string;
    urlImagemComprovante?: string;
    urlDocumentoFrente?: string;
    urlDocumentoVerso?: string;
    urlAssinatura?: string;
    valorTaxaAdquirente?: number;
    confirmadoManualmente?: boolean;
    integracaoDadosGN?: IntegracaoDadosGerenciaNet;
    tokenFoto?: string;
    hashId?: string;
    avaliadorId?: number;
    dataAvaliacao?: Date;
    motivoAvaliacao?: string;
    empresaRequerDocumento?: boolean;
    transacaoId?: number;
    pagamentoId?: number;
    valorDisponivelSplit?: number;
    empresaRequerComprovante?: boolean;
    empresaRequerAssinatura?: boolean;
    respostaAdquirente?: string;
    vencimento?: Date;
    nossaCotacao?: number;
}

export {Transacao, StatusTransacaoEnum}
