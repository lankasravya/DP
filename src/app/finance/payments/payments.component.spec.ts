import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD
=======
<<<<<<< HEAD:src/app/finance/finance.component.spec.ts
import { FinanceComponent } from './finance.component';

describe('FinanceComponent', () => {
  let component: FinanceComponent;
  let fixture: ComponentFixture<FinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceComponent ]
=======
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598
import { PaymentsComponent } from './payments.component';

describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsComponent ]
<<<<<<< HEAD
=======
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598:src/app/stock/payments/payments.component.spec.ts
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD
    fixture = TestBed.createComponent(PaymentsComponent);
=======
<<<<<<< HEAD:src/app/finance/finance.component.spec.ts
    fixture = TestBed.createComponent(FinanceComponent);
=======
    fixture = TestBed.createComponent(PaymentsComponent);
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598:src/app/stock/payments/payments.component.spec.ts
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
