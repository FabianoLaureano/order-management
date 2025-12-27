import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { advanceOrderStateHandler } from "./order.controller.ts";
import { advanceOrderState } from "../services/order.services.ts";
import { orderIdParamSchema } from "../validations/order.validations.ts";

// Mock das dependências para isolar o teste do controller
vi.mock("../services/order.services.ts", () => ({
  advanceOrderState: vi.fn(),
}));

vi.mock("../validations/order.validations.ts", () => ({
  orderIdParamSchema: {
    safeParse: vi.fn(),
  },
}));

vi.mock("../utils/format.ts", () => ({
  formatValidationError: vi.fn().mockReturnValue("Mocked validation details"),
}));

describe("OrderController - advanceOrderStateHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    // Resetar mocks e objetos de request/response antes de cada teste
    vi.clearAllMocks();

    req = {
      params: { id: "123" },
    };

    res = {
      status: vi.fn().mockReturnThis(), // Permite encadeamento .status().json()
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it("deve avançar o estado do pedido com sucesso (200)", async () => {
    // Arrange: Mock da validação passando e serviço retornando sucesso
    vi.mocked(orderIdParamSchema.safeParse).mockReturnValue({
      success: true,
      data: { id: 123 },
    } as any);

    const mockUpdatedOrder = { id: 123, state: "PREPARING" };
    vi.mocked(advanceOrderState).mockResolvedValue({
      updatedOrder: mockUpdatedOrder,
    } as any);

    // Act
    await advanceOrderStateHandler(req as Request, res as Response, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("successfully advanced"),
        order: mockUpdatedOrder,
      })
    );
  });

  it("deve retornar 400 se o ID do pedido for inválido", async () => {
    // Arrange: Mock da validação falhando
    vi.mocked(orderIdParamSchema.safeParse).mockReturnValue({
      success: false,
      error: {},
    } as any);

    // Act
    await advanceOrderStateHandler(req as Request, res as Response, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid URL parameter",
      })
    );
    expect(advanceOrderState).not.toHaveBeenCalled();
  });

  it("deve retornar 404 se o pedido não for encontrado", async () => {
    vi.mocked(orderIdParamSchema.safeParse).mockReturnValue({
      success: true,
      data: { id: 123 },
    } as any);

    // Simula erro de "not found" vindo do serviço
    vi.mocked(advanceOrderState).mockRejectedValue(
      new Error("Order not found")
    );

    await advanceOrderStateHandler(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Order not found" });
  });

  it("deve retornar 400 se o pedido já estiver em estado final ou transição inválida", async () => {
    vi.mocked(orderIdParamSchema.safeParse).mockReturnValue({
      success: true,
      data: { id: 123 },
    } as any);

    // Simula erro de regra de negócio (transição inválida)
    vi.mocked(advanceOrderState).mockRejectedValue(
      new Error("Order is in final state")
    );

    await advanceOrderStateHandler(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Order is in final state" });
  });

  it("deve chamar next(e) para erros desconhecidos", async () => {
    vi.mocked(orderIdParamSchema.safeParse).mockReturnValue({
      success: true,
      data: { id: 123 },
    } as any);

    // Simula um erro inesperado (ex: falha no banco)
    const unexpectedError = new Error("Database connection failed");
    vi.mocked(advanceOrderState).mockRejectedValue(unexpectedError);

    await advanceOrderStateHandler(req as Request, res as Response, next);

    // Verifica se o erro foi passado para o middleware global
    expect(next).toHaveBeenCalledWith(unexpectedError);
    expect(res.status).not.toHaveBeenCalled();
  });
});
