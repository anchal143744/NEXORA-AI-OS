import type {ShopModal} from './shop-forms';
export function canShopAction(modal: ShopModal, capabilities?: Record<string,boolean>) {
  if (!capabilities) return false;
  const has=(...keys:string[])=>keys.every(key=>capabilities[key]===true);
  switch(modal.kind){
    case 'invoice':return has('sales');
    case 'customer':return has('crm',modal.customer?'crmUpdate':'crmCreate');
    case 'followup':return has('crm','crmCreate');
    case 'product':return has('inventory',modal.product?'inventoryUpdate':'inventoryCreate');
    case 'stock':return has('inventory','inventoryUpdate');
    case 'history':return has('inventory');
    case 'sale':return has('sales','salesCreate','inventory');
    case 'payment':return has('finance','financeUpdate');
    case 'payments':return has('finance');
    case 'return':case 'cancel':return has('sales','salesUpdate','inventoryUpdate','financeApprove');
    case 'expense':return has('finance','financeCreate','financeApprove');
  }
}
