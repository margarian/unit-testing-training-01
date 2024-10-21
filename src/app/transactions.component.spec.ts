import { ComponentFixture, TestBed } from '@angular/core/testing';
import TransactionsComponent from './transactions.component';
import { By } from '@angular/platform-browser';
import { AddExpenseComponent } from './add-transaction.component';
import { Transaction } from './types/transaction.type';

describe('TransactionsComponent', () => {
  let fixture: ComponentFixture<TransactionsComponent>;
  let component: TransactionsComponent;
  const newTransactionMock: Pick<Transaction, 'amount' | 'title'> = { title: 'Test', amount: 100};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call openAddTransactionDialog on addTransactionBtn click', () => {
    const addTransactionSpy = spyOn(component, 'openAddTransactionDialog');
    const btn = fixture.debugElement.query(By.css('#addTransactionBtn'));
    btn.triggerEventHandler('click');
    expect(addTransactionSpy).toHaveBeenCalled();
  });

  it('should pass updated value of addTransactionDialogOpen to child', () => {
    component.openAddTransactionDialog();
    fixture.detectChanges();
    const child = fixture.debugElement.query(By.directive(AddExpenseComponent));
    expect(child.componentInstance.open()).toBeTrue();
  });

  it('should call deleteTransaction on deleteTransactionBtn click', () => {
    const deleteTransactionSpy = spyOn(component, 'deleteTransaction');
    const btn = fixture.debugElement.query(By.css('#deleteTransactionBtn'));
    btn.triggerEventHandler('click');
    expect(deleteTransactionSpy).toHaveBeenCalled();
  });

  it('should delete transaction and update table in template after deleteTransaction method call', () => {
    const rowsInitialCount = fixture.debugElement.queryAll(By.css('.transaction-row')).length;
    const deletedTransactionId = component.transactions()[0].id;
    component.deleteTransaction(component.transactions()[0].id);
    fixture.detectChanges();
    const rowsCountAfterDelete = fixture.debugElement.queryAll(By.css('.transaction-row')).length;
    expect(component.transactions().some((t) => t.id === deletedTransactionId)).toBeFalse();
    expect(rowsCountAfterDelete).toBe(rowsInitialCount - 1);
  });

  it('should add transaction and update table in template after addTransaction method call', () => {
    const rowsInitialCount = fixture.debugElement.queryAll(By.css('.transaction-row')).length;
    component.addTransaction(newTransactionMock);
    fixture.detectChanges();
    const rowsCountAfterAdd = fixture.debugElement.queryAll(By.css('.transaction-row')).length;
    expect(component.transactions().some((t) => t.title === newTransactionMock.title)).toBeTrue();
    expect(rowsCountAfterAdd).toBe(rowsInitialCount + 1);
  });

  it('should update currentBalance after transaction add/delete', () => {
    const initialBalance = component.currentBalance();
    const deletedTransactionAmount = component.transactions()[0].amount;
    component.deleteTransaction(component.transactions()[0].id);
    let balanceDiff = -deletedTransactionAmount;
    component.addTransaction(newTransactionMock);
    balanceDiff += newTransactionMock.amount;
    const updatedBalance = component.currentBalance();
    expect(updatedBalance).toBe(initialBalance + balanceDiff);
  });

});
