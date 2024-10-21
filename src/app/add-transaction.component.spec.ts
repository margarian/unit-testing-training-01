import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddExpenseComponent } from './add-transaction.component';
import { By } from '@angular/platform-browser';
import { Transaction } from './types/transaction.type';

describe('AddExpenseComponent', () => {
  let fixture: ComponentFixture<AddExpenseComponent>;
  let component: AddExpenseComponent;
  const newTransactionMock: Pick<Transaction, 'amount'|'title'> = {title: 'Test', amount: 100};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpenseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should change type to income when the income radio button is clicked', () => {
    const incomeRadio = fixture.debugElement.query(By.css('#income'));
    incomeRadio.triggerEventHandler('click');
    expect(component.type()).toBe('income');
  });

  it('should emit transactionAdded with passed values on addTransaction method call', () => {
    const emitSpy = spyOn(component.transactionAdded, 'emit');
    component.form.setValue(newTransactionMock);
    component.type.set('income');
    component.addTransaction();
    expect(emitSpy).toHaveBeenCalledWith(newTransactionMock);
  });

  it('should set negative amount for expense type', () => {
    const emitSpy = spyOn(component.transactionAdded, 'emit');
    component.form.setValue(newTransactionMock);
    component.type.set('expense');
    component.addTransaction();
    expect(emitSpy).toHaveBeenCalledWith({...newTransactionMock, amount: newTransactionMock.amount * -1});
  });

  it('should not emit transactionAdded if form is invalid', () => {
    const emitSpy = spyOn(component.transactionAdded, 'emit');
    component.form.setValue({title: '', amount: 0});
    component.addTransaction();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should reset the form and close dialog when cancel is clicked', () => {
    const setSpy = spyOn(component.open, 'set');
    component.form.setValue(newTransactionMock);
    component.type.set('income');
    component.cancel();
    expect(component.form.value).toEqual({title: '', amount: 0});
    expect(component.type()).toBe('expense');
    expect(setSpy).toHaveBeenCalledWith(false);
  });
});
