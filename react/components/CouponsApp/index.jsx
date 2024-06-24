import React, { useState } from 'react'
import {
  Layout,
  PageBlock,
  PageHeader,
  Button,
  Input,
  ToastProvider,
  ToastConsumer,
  Checkbox,
  DatePicker,
} from 'vtex.styleguide'

const CouponsApp = () => {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [quantity, setQuantity] = useState('')
  const [utmSource, setUtmSource] = useState('')
  const [utmCampaign, setUtmCampaign] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [isArchived, setIsArchived] = useState(false)
  const [maxItemsPerClient, setMaxItemsPerClient] = useState('')
  const [expiryDate, setExpiryDate] = useState(null)

  const handleCreateCupon = async () => {
    setLoading(true)
    setSuccessMessage('')

    try {
      const requestBody = [
        {
          quantity: parseInt(quantity, 10),
          couponConfiguration: {
            utmSource,
            utmCampaign,
            couponCode,
            isArchived,
            maxItemsPerClient: parseInt(maxItemsPerClient, 10),
            expirationIntervalPerUse: expiryDate ? expiryDate.toISOString() : "00:00:00",
            maxUsage: 1,
          },
        },
      ]

      const response = await fetch('/_v/coupons-app', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      if (response.ok) {
        setSuccessMessage('Cupones creados correctamente')
      } else {
        throw new Error('Error en la creación de cupones')
      }
    } catch (e) {
      console.warn('Create coupon API Error', e)
      setSuccessMessage('Error creando cupones')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToastProvider positioning="window">
      <Layout>
        <PageHeader title="Aplicación de Cupones Masivos" />
        <PageBlock>
          <ToastConsumer>
            {({ showToast }) => (
              <div className="w-100 db">
                <strong>Configuración</strong>
                <div className="w-100 mt4">
                  <div className="form-group w-100 mb4">
                    <Input
                      placeholder="Ingrese la cantidad"
                      label="Cantidad"
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                    />
                  </div>

                  <div className="form-group w-100 mb4">
                    <Input
                      placeholder="Ingrese la fuente UTM"
                      label="Fuente UTM"
                      id="utmSource"
                      type="text"
                      value={utmSource}
                      onChange={e => setUtmSource(e.target.value)}
                    />
                  </div>

                  <div className="form-group w-100 mb4">
                    <Input
                      placeholder="Ingrese la campaña UTM"
                      label="Campaña UTM"
                      id="utmCampaign"
                      type="text"
                      value={utmCampaign}
                      onChange={e => setUtmCampaign(e.target.value)}
                    />
                  </div>

                  <div className="form-group w-100 mb4">
                    <Input
                      placeholder="Ingrese el código del cupón"
                      label="Código del Cupón"
                      id="couponCode"
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                    />
                  </div>

                  <div className="form-group w-100 mb4">
                    <Checkbox
                      checked={isArchived}
                      id="isArchived"
                      label="¿Archivar?"
                      name="default-checkbox-group"
                      onChange={() => setIsArchived(!isArchived)}
                      value="isArchived"
                    />
                  </div>

                  <div className="form-group w-100 mb4">
                    <Input
                      placeholder="Ingrese el máximo de ítems por cliente"
                      label="Máximo de Ítems por Cliente"
                      id="maxItemsPerClient"
                      type="number"
                      value={maxItemsPerClient}
                      onChange={e => setMaxItemsPerClient(e.target.value)}
                    />
                  </div>

                  <div className="form-group w-100 mb4">
                    <DatePicker
                      label="Fecha de Expiración"
                      value={expiryDate}
                      onChange={date => setExpiryDate(date)}
                      locale="es-AR"
                    />
                  </div>

                  <div className="w-100 pt4">
                    <Button
                      onClick={handleCreateCupon}
                      isLoading={loading}
                      disabled={loading}
                    >
                      Crear Cupones
                    </Button>
                  </div>

                </div>
                {successMessage && (
                  <div className="mt5">
                    {showToast({
                      message: successMessage,
                      duration: 5000,
                    })}
                  </div>
                )}
              </div>
            )}
          </ToastConsumer>
        </PageBlock>
      </Layout>
    </ToastProvider>
  )
}

export default CouponsApp
