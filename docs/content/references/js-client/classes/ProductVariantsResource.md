# Class: ProductVariantsResource

## Hierarchy

- `default`

  ↳ **`ProductVariantsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreVariantsListRes`](../modules/internal-37.md#storevariantslistres)\>

**`Description`**

Retrieves a list of of Product Variants

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`StoreGetVariantsParams`](internal-37.StoreGetVariantsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreVariantsListRes`](../modules/internal-37.md#storevariantslistres)\>

#### Defined in

[medusa-js/src/resources/product-variants.ts:28](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/product-variants.ts#L28)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreVariantsRes`](../modules/internal-37.md#storevariantsres)\>

**`Description`**

Retrieves a single product variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreVariantsRes`](../modules/internal-37.md#storevariantsres)\>

#### Defined in

[medusa-js/src/resources/product-variants.ts:17](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/product-variants.ts#L17)
