const ERROR = Symbol("Error");


type DisallowKey<K extends string | number | symbol, Obj extends Record<any, any>> = Obj extends Record<
  K,
  any
>
  ? Record<K, never>
  : Obj;
