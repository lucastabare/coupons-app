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
} from 'vtex.styleguide'

const CouponsApp = () => {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [quantity, setQuantity] = useState('')
  const [utmSource, setUtmSource] = useState('')
  const [utmCampaign, setUtmCampaign] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [isArchived, setIsArchived] = useState(false)
  const [maxItemsPerClient, setMaxItemsPerClient] = useState('')
  const [expirationInterval, setExpirationInterval] = useState('')

  const handleCreateCupon = async (showToast) => {
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

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
            expirationIntervalPerUse: expirationInterval || "00:00:00",
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

      console.log("SOY EL RESPONSE ==> ", response)

      if (response.ok) {
        //alert('Cupones creados correctamente')
        showToast({
          message: 'Cupones creados correctamente',
          duration: 5000,
          type: 'success',
        })
      } else {
        //alert('Error al crear el cupon')
        showToast({
          message: 'Error al crear el cupon',
          duration: 5000,
          type: 'error',
        })
      }

    } catch (e) {
      console.warn('Create coupon API Error', e)
      //alert(e.message)
      showToast({
        message: e.message,
        duration: 5000,
        type: 'error',
      })
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
                    <Input
                      placeholder="Intervalo de caducidad en hh:mm:ss"
                      label="Intervalo de caducidad del cupón"
                      id="expirationInterval"
                      type="text"
                      value={expirationInterval}
                      onChange={e => setExpirationInterval(e.target.value)}
                    />
                  </div>

                  <div className="w-100 pt4">
                    <Button
                      onClick={() => handleCreateCupon(showToast)}
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
                      type: 'success',
                    })}
                  </div>
                )}
                {errorMessage && (
                  <div className="mt5">
                    {showToast({
                      message: errorMessage,
                      duration: 5000,
                      type: 'error',
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