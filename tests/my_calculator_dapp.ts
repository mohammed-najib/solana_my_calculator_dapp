// import * as anchor from "@project-serum/anchor";
// import { Program } from "@project-serum/anchor";
// import { MyCalculatorDapp } from "../target/types/my_calculator_dapp";
import * as assert from "assert";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MyCalculatorDapp } from "../target/types/my_calculator_dapp";

const { SystemProgram } = anchor.web3;

// describe("my_calculator_dapp", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.MyCalculatorDapp as Program<MyCalculatorDapp>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

describe("my_calculator_dapp", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace
    .MyCalculatorDapp as Program<MyCalculatorDapp>;

  it("Creates a calculator", async () => {
    await program.methods
      .create("Welcome to Solana")
      .accounts({
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([calculator])
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.greeting === "Welcome to Solana");
  });

  it("Adds two numbers", async () => {
    await program.methods
      .add(new anchor.BN(2), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(5)));
  });

  it("Subtracts two numbers", async () => {
    await program.methods
      .minus(new anchor.BN(2), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(-1)));
  });

  it("Multiplies two numbers", async () => {
    await program.methods
      .multiply(new anchor.BN(4), new anchor.BN(2))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(8)));
  });

  it("Divids two numbers (result remainder = 0)", async () => {
    await program.methods
      .divide(new anchor.BN(4), new anchor.BN(2))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(2)));
    assert.ok(account.remainder.eq(new anchor.BN(0)));
  });

  it("Divids two numbers (result remainder != 0)", async () => {
    await program.methods
      .divide(new anchor.BN(2), new anchor.BN(4))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(0)));
    assert.ok(account.remainder.eq(new anchor.BN(2)));
  });
});
